from nfc_reader.py_acr122u.acr122u import Acr122u

if __name__ == '__main__':
    reader = Acr122u(connect=True)

    reader.disable_buzzer_on_card_detect()

    reader.print_data(reader.get_uid())

    reader.led_accept()
    reader.led_deny()
    reader.print_data(reader.get_uid())
    reader.info()
