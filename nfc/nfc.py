from threading import Thread
from time import sleep
from typing import Optional

from smartcard.Card import Card
from smartcard.CardConnection import CardConnection
from smartcard.CardMonitoring import CardObserver, CardMonitor
from smartcard.util import toHexString

from nfc.models import LastConnectedCard

GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]
"""Command to get card uid"""


class LastConnectedCardObserver(CardObserver):

    def __init__(self):
        """Observe insertion/removal of cards and store the last connected card in the database"""
        super().__init__()
        self.currently_connected_card_uid: Optional[str] = None

    def update(self, observable, handlers: tuple[list[Card], list[Card]]) -> None:
        cards_added, cards_removed = handlers
        for card in cards_added:  # This block only runs when cards are connected
            # Create connection to card
            card_connection: CardConnection = card.createConnection()
            card_connection.connect()

            # Get UID from card
            response, sw1, sw2 = card_connection.transmit(GET_UID)
            self.currently_connected_card_uid = toHexString(response)
            print(f"+Inserted: {self.currently_connected_card_uid}")  # TODO: replace with logging

            # Add to database
            currently_connected_card = LastConnectedCard(card_uid=self.currently_connected_card_uid)
            currently_connected_card.save()

        for card in cards_removed:  # This block only runs when cards are removed
            last_connected_cards = LastConnectedCard.objects.all()  # Get all cards (should be 1 or 0)
            for last_card in last_connected_cards:  # Delete all cards
                # (does not actually delete but sets currently_connected to false)
                last_card.delete()

            print(f"- Removed: {self.currently_connected_card_uid}")  # TODO: replace with logging
            self.currently_connected_card_uid = None


class Acr122uWaitingThread(Thread):
    def __init__(self) -> None:
        super().__init__(name="ACR122U", daemon=True)
        self.card_monitor = CardMonitor()
        self.card_observer = LastConnectedCardObserver()

    def run(self) -> None:
        print(f"Starting {self.name}")  # TODO: Replace with logging

        self.card_monitor.addObserver(self.card_observer)  # Start observing card insertion/removal

        while True:  # Loop forever
            sleep(10)  # Sleep for some time since this thread does nothing anymore, uses almost noviews.py CPU this way
