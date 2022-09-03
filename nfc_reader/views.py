from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from nfc_reader.models import UserNfcCard
from nfc_reader.serializers import UserNfcCardSerializer


@api_view(['GET', 'POST', 'DELETE'])
def nfc_card(req: Request, username: str) -> Response:
    """
    GET the nfc card association with a username, POST a new nfc card association (overwriting any existing
    associations), or DELETE an nfc card association with a username.

    :param req: Request object
    :param username: Username of the user for which the operation is called
    """
    if req.method == 'GET':
        try:
            user_nfc_card = UserNfcCard.objects.get(username=username)  # Get from database
            user_nfc_card_serializer = UserNfcCardSerializer(user_nfc_card)  # Convert to JSON format
            return Response(data=user_nfc_card_serializer.data, status=status.HTTP_200_OK)
        except UserNfcCard.DoesNotExist:  # This username does not exist in the database, return 404
            return Response(status=status.HTTP_404_NOT_FOUND)

    if req.method == 'POST':
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

    if req.method == 'DELETE':
        try:
            user_nfc_card = UserNfcCard.objects.get(username=username)
            user_nfc_card.delete()
            return Response(status=status.HTTP_200_OK)
        except UserNfcCard.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def all_nfc_cards(req: Request) -> Response:
    """Get all user nfc card associations"""
    all_user_nfc_cards = UserNfcCard.objects.all()
    all_user_nfc_card_serializer = UserNfcCardSerializer(all_user_nfc_cards, many=True)
    return Response(data=all_user_nfc_card_serializer.data, status=200)
