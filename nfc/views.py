from typing import Optional

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from nfc.models import UserNfcCard, LastConnectedCard
from nfc.serializers import UserNfcCardSerializer, LastConnectedCardSerializer


class NfcCardAPIView(APIView):
    """
    Get the nfc card associated with a username, create a new nfc card association or delete an existing association.
    """

    def get(self, req: Request, username: str) -> Response:
        """
        GET the nfc card association with a username.

        :param req: Request object
        :param username: Username of the user for which the operation is called
        """
        try:
            user_nfc_card = UserNfcCard.objects.get(username=username)  # Get from database
            user_nfc_card_serializer = UserNfcCardSerializer(user_nfc_card)  # Convert to JSON format
            return Response(data=user_nfc_card_serializer.data, status=status.HTTP_200_OK)
        except UserNfcCard.DoesNotExist:  # This username does not exist in the database, return 404
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, req: Request, username: str) -> Response:
        """
        POST a new nfc card association (overwriting any existing associations).

        :param req: Request object
        :param username: Username of the user for which the operation is called
        """
        req.data['username'] = username

        try:
            user_nfc_card = UserNfcCard.objects.get(username=username)  # Get from database
            # If this user already exists in database, update the existing entry
            user_nfc_card_serializer = UserNfcCardSerializer(user_nfc_card, data=req.data)

        except UserNfcCard.DoesNotExist:  # If username is not in database, create new entry
            user_nfc_card_serializer = UserNfcCardSerializer(data=req.data)

        if user_nfc_card_serializer.is_valid():  # Check if data provided is valid
            user_nfc_card_serializer.save()  # Commit to database
            return Response(user_nfc_card_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_nfc_card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, req: Request, username: str) -> Response:
        """
        DELETE an nfc card association with a username.

        :param req: Request object
        :param username: Username of the user for which the operation is called
        """
        try:
            user_nfc_card = UserNfcCard.objects.get(username=username)
            user_nfc_card.delete()
            return Response(status=status.HTTP_200_OK)
        except UserNfcCard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class LastConnectedNfcCardAPIView(APIView):
    """
    Get the last connected NFC card
    """

    def get(self, req: Request) -> Response:
        """
        Get the last connected card. Takes a querystring called "seconds" to only return a card if it is at most that many
        seconds old.

        Returns a 404 error if no card was ever added to the reader since startup, or if the last card added to the reader
        is older than seconds.
        """
        query_params = req.query_params
        seconds: Optional[int] = query_params.get("seconds",
                                                  None)  # Extract the seconds from querystring, default to None
        if seconds is not None:  # If seconds was passed, convert it to an integer
            seconds = int(seconds)
        try:
            last_card = LastConnectedCard.objects.get()
            if last_card.was_connected_recently(seconds=seconds):  # If card was connected recently, return the card
                last_card_serializer = LastConnectedCardSerializer(last_card)
                return Response(data=last_card_serializer.data, status=status.HTTP_200_OK)

        except LastConnectedCard.DoesNotExist:  # If no card was connected yet, move to the return statement
            pass

        # If no cards are connected yet or the last card was not connected recently, return an error
        return Response(status=status.HTTP_404_NOT_FOUND)


class AllNfcCardsAPIView(APIView):
    """
    Get a list of all stored NFC card and username associations.
    """

    def get(self, req: Request) -> Response:
        """Get all user nfc card associations"""
        all_user_nfc_cards = UserNfcCard.objects.all()
        all_user_nfc_card_serializer = UserNfcCardSerializer(all_user_nfc_cards, many=True)
        return Response(data=all_user_nfc_card_serializer.data, status=200)
