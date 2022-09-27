import functools
import logging
from datetime import datetime as DateTime, timedelta as TimeDelta, timezone as TimeZone

from django.urls import reverse
from freezegun import freeze_time
from rest_framework import status
from rest_framework.test import APITestCase

from nfc.models import UserNfcCard, LastConnectedCard


def prevent_request_warnings(original_function):
    """
    Based on: https://stackoverflow.com/a/46079090

    If we need to test for errors in requests we can use this decorator to prevent logging a warning message
    """

    @functools.wraps(original_function)
    def new_function(*args, **kwargs):
        # raise logging level to ERROR
        logger = logging.getLogger('django.request')
        previous_logging_level = logger.getEffectiveLevel()
        logger.setLevel(logging.ERROR)

        # trigger original function that would throw warning
        original_function(*args, **kwargs)

        # lower logging level back to previous
        logger.setLevel(previous_logging_level)

    return new_function


class TestData:
    test_username1 = "s9999999"
    test_username2 = "s9999998"

    test_card_uid1 = "00 00 00 00 00 00 00"
    test_card_uid2 = "00 00 00 00"


class NfcTests(APITestCase):

    def test_create_nfc_card(self) -> None:
        """Ensure an nfc card can be created"""
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        data = {"card_uid": TestData.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, TestData.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, TestData.test_card_uid1)

        # Add second card UID and username
        url = reverse("nfc:nfc-card", args=[TestData.test_username2])
        data = {"card_uid": TestData.test_card_uid2}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 2)

    def test_create_nfc_card_overwrite(self) -> None:
        """Ensure that posting an nfc card to an existing username will overwrite the previous card UID"""
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        data = {"card_uid": TestData.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, TestData.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, TestData.test_card_uid1)

        # Post same object again to overwrite data, but nothing will have changed
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, TestData.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, TestData.test_card_uid1)

        # Post another card uid to the same username to update the card uid
        data = data = {"card_uid": TestData.test_card_uid2}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, TestData.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, TestData.test_card_uid2)

    @prevent_request_warnings
    def test_create_nfc_card_error(self) -> None:
        """Ensure that no two usernames can add the same card UID"""
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        data = {"card_uid": TestData.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, TestData.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, TestData.test_card_uid1)

        # Post the same card uid for a different username to trigger an error response
        url = reverse("nfc:nfc-card", args=[TestData.test_username2])
        data = {"card_uid": TestData.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, TestData.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, TestData.test_card_uid1)

    def test_read_nfc_card(self) -> None:
        """Ensure a card can be read"""
        # Create a card first
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        data = {"card_uid": TestData.test_card_uid1}
        self.client.post(path=url, data=data, format="json")

        # Read response
        response = self.client.get(path=url)
        self.assertEqual(response.data["username"], TestData.test_username1)
        self.assertEqual(response.data["card_uid"], TestData.test_card_uid1)

    @prevent_request_warnings
    def test_read_nfc_card_error(self) -> None:
        """Ensure that reading a card from a nonexistent username returns an http error"""
        # Do not post a card but immediately try to read
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nfc_card(self) -> None:
        """Ensure that deleting a card works"""
        # Post a card first
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        data = {"card_uid": TestData.test_card_uid1}
        self.client.post(path=url, data=data, format="json")
        self.assertEqual(UserNfcCard.objects.count(), 1)

        # Delete the card for the same username
        response = self.client.delete(path=url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserNfcCard.objects.count(), 0)

    @prevent_request_warnings
    def test_delete_nfc_card_error(self) -> None:
        """Ensure that deleting a card for a user which has no card associated return an error code"""
        # Do not post a card but immediately try to delete
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        response = self.client.delete(path=url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_nfc_cards(self) -> None:
        """Ensure that getting all nfc cards works"""
        # Get all nfc cards from an empty database
        url = reverse("nfc:all-nfc-cards")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        # Post two cards
        url = reverse("nfc:nfc-card", args=[TestData.test_username1])
        data = {"card_uid": TestData.test_card_uid1}
        self.client.post(path=url, data=data, format="json")

        url = reverse("nfc:nfc-card", args=[TestData.test_username2])
        data = {"card_uid": TestData.test_card_uid2}
        self.client.post(path=url, data=data, format="json")

        # Get all nfc cards again
        url = reverse("nfc:all-nfc-cards")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class LastConnectedCardTest(APITestCase):
    def test_create(self) -> None:
        """Ensure that creating a last connected card works"""
        card = LastConnectedCard(card_uid=TestData.test_card_uid1)
        card.save()
        self.assertEqual(LastConnectedCard.objects.count(), 1)
        self.assertEqual(LastConnectedCard.objects.get().card_uid, TestData.test_card_uid1)
        self.assertEqual(LastConnectedCard.objects.get().currently_connected, True)

    def test_overwrite(self) -> None:
        """Ensure that creating a last connected card replaces the existing card so there is one row in the database"""
        # Add card 1
        card = LastConnectedCard(card_uid=TestData.test_card_uid1)
        card.save()
        card1_connected = card.connected.replace(tzinfo=TimeZone.utc)  # Store current time with correct timezone

        self.assertEqual(LastConnectedCard.objects.count(), 1)
        self.assertEqual(LastConnectedCard.objects.get().card_uid, TestData.test_card_uid1)
        self.assertEqual(LastConnectedCard.objects.get().currently_connected, True)
        # Ensure they have the same DateTime as the stored card (disregard timezone)
        self.assertEqual(LastConnectedCard.objects.get().connected, card1_connected)

        # Add card 2 which should overwrite card 1
        card = LastConnectedCard(card_uid=TestData.test_card_uid2)
        card.save()
        self.assertEqual(LastConnectedCard.objects.count(), 1)
        self.assertEqual(LastConnectedCard.objects.get().card_uid, TestData.test_card_uid2)
        self.assertEqual(LastConnectedCard.objects.get().currently_connected, True)
        # Ensure they have different DateTime as the stored card
        self.assertNotEqual(LastConnectedCard.objects.get().connected, card1_connected)

    def test_delete(self) -> None:
        """Ensure the delete function does not actually delete a card but changes currently_connected instead"""
        # Add card 1
        card = LastConnectedCard(card_uid=TestData.test_card_uid1)
        card.save()
        card1_connected = card.connected.replace(tzinfo=TimeZone.utc)  # Store current time with correct timezone
        self.assertEqual(LastConnectedCard.objects.count(), 1)
        self.assertEqual(LastConnectedCard.objects.get().card_uid, TestData.test_card_uid1)
        self.assertEqual(LastConnectedCard.objects.get().currently_connected, True)

        card.delete()
        self.assertEqual(LastConnectedCard.objects.count(), 1)
        self.assertEqual(LastConnectedCard.objects.get().card_uid, TestData.test_card_uid1)
        self.assertEqual(LastConnectedCard.objects.get().currently_connected, False)
        # Ensure that the connected DateTime did not change
        self.assertEqual(LastConnectedCard.objects.get().connected, card1_connected)

    def test_was_connected_recently(self) -> None:
        """Ensure that the was_connected_recently method works when passing time"""
        # Set a specific time to freeze so we can emulate passing time in a unit test with freezegun library
        set_time = DateTime(year=2022, month=9, day=5, hour=17, minute=0, second=0, tzinfo=TimeZone.utc)
        with freeze_time(set_time) as frozen_time:  # Freeze time, all calls to .now() return the set_time
            # Add card 1
            card = LastConnectedCard(card_uid=TestData.test_card_uid1)
            card.save()
            self.assertTrue(LastConnectedCard.objects.get().was_connected_recently(seconds=10))
            frozen_time.move_to(set_time + TimeDelta(seconds=15))  # Move time forward 15 seconds
            self.assertFalse(LastConnectedCard.objects.get().was_connected_recently(seconds=10))

            # Add new card which should update the card connected to the current time
            card2 = LastConnectedCard(card_uid=TestData.test_card_uid2)
            card2.save()
            self.assertTrue(LastConnectedCard.objects.get().was_connected_recently(seconds=10))

    def test_was_connected_recently_none(self) -> None:
        """Ensure that the was_connected_recently method always returns True if None is passed"""
        # Set a specific time to freeze so we can emulate passing time in a unit test with freezegun library
        set_time = DateTime(year=2022, month=9, day=5, hour=17, minute=0, second=0, tzinfo=TimeZone.utc)
        with freeze_time(set_time) as frozen_time:  # Freeze time, all calls to .now() return the set_time
            # Add card 1
            card = LastConnectedCard(card_uid=TestData.test_card_uid1)
            card.save()
            self.assertTrue(LastConnectedCard.objects.get().was_connected_recently(seconds=10))
            self.assertTrue(LastConnectedCard.objects.get().was_connected_recently(seconds=None))

            frozen_time.move_to(set_time + TimeDelta(seconds=15))  # Move time forward 15 seconds
            self.assertFalse(LastConnectedCard.objects.get().was_connected_recently(seconds=10))
            self.assertTrue(LastConnectedCard.objects.get().was_connected_recently(seconds=None))

    def test_get_last_connected_card(self) -> None:
        """Ensure that getting the last connected card from the API works without seconds query parameter"""
        card = LastConnectedCard(card_uid=TestData.test_card_uid1)
        card.save()

        url = f"{reverse('nfc:last-connected-card')}"
        response = self.client.get(path=url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["card_uid"], TestData.test_card_uid1)
        self.assertTrue(response.data["currently_connected"])
        self.assertNotIn("id", response.data)  # Ensure ID is not sent since that information is irrelevant

    def test_get_last_connected_card_seconds(self) -> None:
        """Ensure that getting the last connected card from the API works without seconds query parameter"""
        # Set a specific time to freeze so we can emulate passing time in a unit test with freezegun library
        set_time = DateTime(year=2022, month=9, day=5, hour=17, minute=0, second=0, tzinfo=TimeZone.utc)
        with freeze_time(set_time) as frozen_time:  # Freeze time, all calls to .now() return the set_time
            # Add card 1
            card = LastConnectedCard(card_uid=TestData.test_card_uid1)
            card.save()

            # Get the last connected card within 10 seconds
            url_10 = f"{reverse('nfc:last-connected-card')}?seconds={10}"
            response = self.client.get(path=url_10)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            frozen_time.move_to(set_time + TimeDelta(seconds=15))  # Move time forward 15 seconds

            response = self.client.get(path=url_10)  # The card should be too old now
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_last_connected_card_error(self) -> None:
        """Ensure that getting a card when no recent card is stored in the database returns an error"""
        url = f"{reverse('nfc:last-connected-card')}"
        response = self.client.get(path=url)  # Get the card without storing a card in the database first

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
