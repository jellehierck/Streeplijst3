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
            user_nfc_card = UserNfcCard.objects.get(username=username)
            user_nfc_card_serializer = UserNfcCardSerializer(user_nfc_card)
            return Response(data=user_nfc_card_serializer.data, status=200)
        except UserNfcCard.DoesNotExist:
            return Response(status=404)
    pass


@api_view(['GET'])
def all_nfc_cards(req: Request) -> Response:
    """Get all user nfc card associations"""
    all_user_nfc_cards = UserNfcCard.objects.all()
    all_user_nfc_card_serializers = [UserNfcCardSerializer(user_nfc_card) for user_nfc_card in all_user_nfc_cards]
    all_data = [user_nfc_card_serializer.data for user_nfc_card_serializer in all_user_nfc_card_serializers]
    return Response(data=all_data, status=200)
    pass
