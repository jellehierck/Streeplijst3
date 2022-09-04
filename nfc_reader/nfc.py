from threading import Thread
from time import sleep
from typing import Optional

from smartcard.Card import Card
from smartcard.CardConnection import CardConnection
from smartcard.CardMonitoring import CardObserver, CardMonitor
from smartcard.util import toHexString

from nfc_reader.models import CurrentlyConnectedCard

GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]
"""Command to get card uid"""


class CurrentlyConnectedCardObserver(CardObserver):

    def __init__(self):
        """Observe insertion/removal of cards and store the currently connected card in the database"""
        super().__init__()
        self.currently_connected_card_uid: Optional[str] = None

    def update(self, observable, handlers: tuple[list[Card], list[Card]]) -> None:
        cards_added, cards_removed = handlers
        for card in cards_added:
            print(f"+Inserted: {toHexString(card.atr)}")
            card_connection: CardConnection = card.createConnection()
            card_connection.connect()
            response, sw1, sw2 = card_connection.transmit(GET_UID)
            self.currently_connected_card_uid = toHexString(response)
            currently_connected_card = CurrentlyConnectedCard(card_uid=self.currently_connected_card_uid)
            currently_connected_card.save()
            print(f"uid: {currently_connected_card}")

        for card in cards_removed:
            print(f"- Removed: {toHexString(card.atr)}")
            # Remove from database
            print(f"uid: {self.currently_connected_card_uid}")
            self.currently_connected_card_uid = None


class Acr122uWaitingThread(Thread):
    def __init__(self) -> None:
        super().__init__(name="ACR122U", daemon=True)
        self.card_monitor = CardMonitor()
        self.card_observer = CurrentlyConnectedCardObserver()

    def run(self) -> None:
        print(f"Starting {self.name}")  # TODO: Replace with logging

        self.card_monitor.addObserver(self.card_observer)  # Start observing card insertion/removal

        while True:  # Loop forever
            sleep(10)  # Sleep for some time since this thread does nothing anymore
