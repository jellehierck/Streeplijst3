from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from nfc_reader.models import UserNfcCard

import logging
import functools


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


class NfcTests(APITestCase):
    test_username1 = "s9999999"
    test_username2 = "s9999998"

    test_card_uid1 = "00 00 00 00 00 00 00"
    test_card_uid2 = "00 00 00 00"

    def test_create_nfc_card(self) -> None:
        """Ensure an nfc card can be created"""
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        data = {"card_uid": self.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, self.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, self.test_card_uid1)

        # Add second card UID and username
        url = reverse("nfc:nfc-card", args=[self.test_username2])
        data = {"card_uid": self.test_card_uid2}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 2)

    def test_create_nfc_card_overwrite(self) -> None:
        """Ensure that posting an nfc card to an existing username will overwrite the previous card UID"""
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        data = {"card_uid": self.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, self.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, self.test_card_uid1)

        # Post same object again to overwrite data, but nothing will have changed
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, self.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, self.test_card_uid1)

        # Post another card uid to the same username to update the card uid
        data = data = {"card_uid": self.test_card_uid2}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, self.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, self.test_card_uid2)

    @prevent_request_warnings
    def test_create_nfc_card_error(self) -> None:
        """Ensure that no two usernames can add the same card UID"""
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        data = {"card_uid": self.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, self.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, self.test_card_uid1)

        # Post the same card uid for a different username to trigger an error response
        url = reverse("nfc:nfc-card", args=[self.test_username2])
        data = {"card_uid": self.test_card_uid1}
        response = self.client.post(path=url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UserNfcCard.objects.count(), 1)
        self.assertEqual(UserNfcCard.objects.get().username, self.test_username1)
        self.assertEqual(UserNfcCard.objects.get().card_uid, self.test_card_uid1)

    def test_read_nfc_card(self) -> None:
        """Ensure a card can be read"""
        # Create a card first
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        data = {"card_uid": self.test_card_uid1}
        self.client.post(path=url, data=data, format="json")

        # Read response
        response = self.client.get(path=url)
        self.assertEqual(response.data["username"], self.test_username1)
        self.assertEqual(response.data["card_uid"], self.test_card_uid1)

    @prevent_request_warnings
    def test_read_nfc_card_error(self) -> None:
        """Ensure that reading a card from a nonexistent username returns an http error"""
        # Do not post a card but immediately try to read
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        response = self.client.get(path=url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nfc_card(self) -> None:
        """Ensure that deleting a card works"""
        # Post a card first
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        data = {"card_uid": self.test_card_uid1}
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
        url = reverse("nfc:nfc-card", args=[self.test_username1])
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
        url = reverse("nfc:nfc-card", args=[self.test_username1])
        data = {"card_uid": self.test_card_uid1}
        self.client.post(path=url, data=data, format="json")

        url = reverse("nfc:nfc-card", args=[self.test_username2])
        data = {"card_uid": self.test_card_uid2}
        self.client.post(path=url, data=data, format="json")

        # Get all nfc cards again
        url = reverse("nfc:all-nfc-cards")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
