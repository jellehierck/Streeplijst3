from threading import Thread
from typing import Optional

import smartcard.System
from smartcard.ATR import ATR
from smartcard.CardConnection import CardConnection
from smartcard.CardRequest import CardRequest
from smartcard.Exceptions import NoCardException, NoReadersException
from smartcard.reader import Reader
from smartcard.util import toHexString

from nfc_reader.py_acr122u.error import InstructionFailedError, OptionOutOfRangeError, NotInitializedError
from nfc_reader.py_acr122u.option import cards, answers, alias, commands
from nfc_reader.py_acr122u.utils import int_list_to_hexadecimal_list, int_list_to_string_list, replace_arguments


class Acr122u:
    def __init__(self, connect: bool = False):
        """
        Create an ACR122U object. Documentation: http://downloads.acs.com.hk/drivers/en/API-ACR122U-2.054.pdf

        :param connect: Whether to connect to a card right after instantiation
        """
        self.reader: Reader = self.instantiate_reader()

        self.connection: Optional[CardConnection] = None
        if connect is True:
            self.connection = self.instantiate_connection(self.reader)

    @staticmethod
    def instantiate_reader() -> Reader:
        """
        Get all smartcard readers and return the first one.
        """
        readers = smartcard.System.readers()
        if not readers:
            raise NoReadersException()

        return readers[0]  # Return only the first one

    @staticmethod
    def instantiate_connection(reader: Reader) -> CardConnection:

        if not reader:
            raise NotInitializedError("Reader object is not initialized, run instantiate_reader() first")

        connection: CardConnection = reader.createConnection()

        try:
            connection.connect()
        except NoCardException as e:
            raise NoCardException(message="No connection possible, check that there is a card on the reader",
                                  hresult=e.hresult)

        return connection

    def command(self, mode, arguments=None) -> list[int]:
        """send a payload to the reader

        Format:
            CLA INS P1 P2 P3 Lc Data Le

        The Le field (optional) indicates the maximum length of the response.
        The Lc field indicates the length of the outgoing data.

        Mandatory:
            CLA INS P1 P2

        Attributes:
            mode: key value of option.options or option.alias
            arguments: replace `-1` in the payload by arguments

        Returns:
            return the data or sw1 sw2 depending on the request"""

        if not self.connection:
            raise NotInitializedError("Connection is not established yet, run instantiate_connection() first")

        mode = alias.get(mode) or mode
        payload = commands.get(mode)

        if not payload:
            raise OptionOutOfRangeError(f"Command {mode} does not exist in possible commands: {commands.keys()}")

        payload = replace_arguments(payload, arguments)  # Replace the required arguments
        result = self.connection.transmit(payload)

        if len(result) == 3:
            data, sw1, sw2 = result
        else:
            data, n, sw1, sw2 = result

        # Check whether the command was successful
        if sw1 == answers.get("success"):  # Success
            if data:
                return data
            else:
                return [sw2]

        elif sw1 == answers.get("fail"):  # Failure
            raise InstructionFailedError(f"Payload {payload} failed predictably", sw1=sw1, sw2=sw2)

        else:  # Some other return code was sent, raise error
            raise InstructionFailedError(f"Payload {payload} failed with unknown return codes", sw1=sw1, sw2=sw2)

    def custom(self, payload):
        """send a custom payload to the reader

        Format:
            CLA INS P1 P2 P3 Lc Data Le"""
        result = self.connection.transmit(payload)

        if len(result) == 3:
            data, sw1, sw2 = result
        else:
            data, n, sw1, sw2 = result

        # Check whether the command was successful
        if sw1 == answers.get("success"):  # Success
            if data:
                return data
            else:
                return [sw2]

        elif sw1 == answers.get("fail"):  # Failure
            raise InstructionFailedError(f"Payload {payload} failed predictably", sw1=sw1, sw2=sw2)

        else:  # Some other return code was sent, raise error
            raise InstructionFailedError(f"Payload {payload} failed with unknown return codes", sw1=sw1, sw2=sw2)

    def get_uid(self):
        """get the uid of the card"""
        return self.command("get_uid")

    def firmware_version(self):
        """get the firmware version of the reader"""
        return self.command("firmware_version")

    def load_authentication_data(self, key_location, key_value):
        """load the authentication key

        Attributes:
            key location : 0x00 ~ 0x01
            key value : 6 bytes

        Example:
            E.g. 0x01, [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]"""
        self.command("load_authentication_data", [key_location, key_value])

    def authentication(self, bloc_number, key_type, key_location):
        """authentication with the key in `load_authentication_data`

        Attributes:
            block number : 1 byte
            key type A/B : 0x60 ~ 0x61
            key location : 0x00 ~ 0x01

        Example:
            E.g. 0x00, 0x61, 0x01"""
        self.command("authentication", [bloc_number, key_type, key_location])

    def read_binary_blocks(self, block_number, number_of_byte_to_read):
        """read n bytes in the card at the block_number index

        Attributes:
            block number : 1 byte
            number of Bytes to read : 1

        Example:
            E.g. 0x00, 0x02"""
        return self.command("read_binary_blocks", [block_number, number_of_byte_to_read])

    def update_binary_blocks(self, block_number, number_of_byte_to_update, block_data):
        """update n bytes in the card with block_data at the block_number index

        Attributes:
            block number : 1 byte
            number of Bytes to update : 1-16 bytes
            block data : 4-16 bytes

        Examples:
            0x01, 0x10, [0x00, 0x01, 0x02, 0x03, 0x04, 0x05
            0x07, 0x08, 0x09, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15]"""
        self.command("update_binary_blocks", [block_number, number_of_byte_to_update, block_data])

    def led_control(self, led_state: int, t1: int, t2: int, nr_repetitions: int, link_to_buzzer: int):
        """
        Control led state, see chapter 6.2 in Application Programming Interface V2.04.

        :param led_state: 8-bit LED control (0b0000_0000, most significant byte is left, see chapter 6.2)
        :param t1: Initial blinking state (units of 100 ms)
        :param t2: Toggle blinking state (units of 100 ms)
        :param nr_repetitions: How often the control is repeated
        :param link_to_buzzer: Link to buzzer, values 0x00-0x03 (see chapter 6.2)

        Example: led_control(0b000_0101, 1, 1, 2, 0x01)

        """
        self.command("led_control", [led_state, t1, t2, nr_repetitions, link_to_buzzer])

    def get_picc_version(self):
        """get the PICC version of the reader"""
        return self.command("get_picc_version")

    def set_picc_version(self, picc_value):
        """set the PICC version of the reader

        Attributes:
            PICC value: 1 byte, default is 0xFF

        Example:
            0xFF"""
        self.command("set_picc_version", [picc_value])

    def buzzer_sound(self, poll_buzzer_status):
        """set the buzzer sound state

        Attributes:
            poll buzz status : 0x00 ~ 0xFF

        Example:
            0x00"""
        self.command("buzzer_sound", [poll_buzzer_status])

    def set_timeout(self, timeout_parameter):
        """set the timeout of the reader

        Attributes:
            timeout parameter : 0x00 ~ 0x01 - 0xFE ~ 0xFF : (0,  5 second unit, infinite), default is 0xFF

        Example:
            0x01"""
        self.command("set_timeout", [timeout_parameter])

    def info(self):
        """print the type of the card on the reader"""
        atr = ATR(self.connection.getATR())
        historical_byte = toHexString(atr.getHistoricalBytes(), 0)
        print(historical_byte)
        print(historical_byte[-17:-12])
        card_name = historical_byte[-17:-12]
        name = cards.get(card_name, "")
        print(
            f"Card Name: {name}\n\tT0 {atr.isT0Supported()}\n\tT1 {atr.isT1Supported()}\n\tT15 {atr.isT15Supported()}")

    def led_accept(self) -> None:
        """
        Perform a buzzer and led indicating a successful operation.
        """
        self.led_control(0b1010_0010, 1, 1, 1, 0x2)

    def led_deny(self) -> None:
        """
        Perform a buzzer and led indicating a successful operation.
        """
        self.led_control(0b0101_0001, 1, 1, 3, 0x1)

    def led_blink_once(self) -> None:
        """
        Blink once.
        """
        self.led_control(0b0101_0001, 1, 1, 1, 0x0)

    def enable_buzzer_on_card_detect(self) -> None:
        """Enables the buzzer sound on detection of card."""
        self.buzzer_sound(0xFF)

    def disable_buzzer_on_card_detect(self) -> None:
        """Disables the buzzer sound on detection of card."""
        self.buzzer_sound(0x00)

    @staticmethod
    def print_data(data):
        print(f"data:\n\t{data}"
              f"\n\t{int_list_to_hexadecimal_list(data)}"
              f"\n\t{int_list_to_string_list(data)}")

    @staticmethod
    def print_sw1_sw2(sw1, sw2):
        print(f"sw1 : {sw1} {hex(sw1)}\n"
              f"sw2 : {sw2} {hex(sw2)}")


class Acr122uWaitingThread(Thread, Acr122u):
    def __init__(self) -> None:
        super().__init__(name="ACR122U", daemon=True)
        # self.reader = Acr122u(connect=False)

    def run(self) -> None:
        print(f"Starting {self.name}")

        # TODO: Handle case in which reader is not connected yet or is disconnected

        while True:
            print("Waiting for next card")
            card_request = CardRequest(newcardonly=True,  # Only accept a card which is not already on the reader
                                       # readers=[self.reader],
                                       timeout=None)
            try:
                card_service = card_request.waitforcard()  # Wait  until a card is detected
                self.connection: CardConnection = card_service.connection  # Store the connection
                self.connection.connect()  # Establish connection

                self.disable_buzzer_on_card_detect()
                print(f"Card read from {self.connection.getReader()}, "
                      f"ATR: {toHexString(self.connection.getATR())}, "
                      f"uid: {toHexString(self.get_uid())}")

                self.connection.disconnect()  # Disconnect from the card again

            except NoCardException as e:
                print("Card removed unexpectedly")
                raise e


if __name__ == '__main__':
    nfc_waiting_service = Acr122uWaitingThread()
    nfc_waiting_service.start()
    nfc_waiting_service.join()
