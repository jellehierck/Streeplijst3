from typing import Optional

from channels.generic.websocket import JsonWebsocketConsumer
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.mixins import DeleteModelMixin, CreateModelMixin, PatchModelMixin, RetrieveModelMixin
from djangochannelsrestframework.observer import model_observer
from rest_framework import status

from nfc.models import UserNfcCard, LastConnectedCard
from nfc.serializers import LastConnectedCardSerializer, UserNfcCardSerializer


class NfcJSONMessage(dict):
    UNSPECIFIED = "unspecified"
    ACCEPT = "accept"
    LAST_CONNECTED_CARD_ACTIVITY = "last-connected-card-activity"

    def __init__(self, action: str = UNSPECIFIED, data: any = None, **kwargs):
        """
        Initialize a standard JSON message format for NFC WebSocket connection
        :param action: Message action, defaults to "unspecified"
        :param data: Data to send
        :param kwargs: Other keyword arguments to send
        """
        super().__init__(action=action, data=data, **kwargs)


class NfcConsumer(GenericAsyncAPIConsumer,
                  CreateModelMixin,
                  RetrieveModelMixin,
                  PatchModelMixin,
                  DeleteModelMixin):
    """
    WebSocket consumer which will send messages whenever the LastConnectedCard database table changes according to
    example on https://djangochannelsrestframework.readthedocs.io/en/latest/examples/model_observer.html

    It will also handle Create, Retrieve, Update and Delete actions sent through the websocket
    """

    queryset = UserNfcCard.objects.all()  # CRUD operations from mixins will work on these objects
    serializer_class = UserNfcCardSerializer  # Serializer class to define the structure of data sent and received
    lookup_field = "username"  # Which field of UserNfcCard to treat as primary key (.pk)

    async def connect(self) -> None:
        """Runs on new connection to websocket"""
        await self.accept()
        await self.send_json(NfcJSONMessage(action=NfcJSONMessage.ACCEPT))

    @model_observer(LastConnectedCard)
    async def last_connected_card_activity(self,
                                           message: LastConnectedCardSerializer,
                                           observer=None,
                                           subscribing_request_ids: list = None,
                                           **kwargs) -> None:
        """
        This method is run whenever the LastConnectedCard database changes and will include the latest update.

        :param message: Serialized LastConnectedCard instance after update in the database
        :param observer: Not used
        :param subscribing_request_ids: List of request IDs which are currently subscribed to this model
        """
        for request_id in subscribing_request_ids:
            await self.reply(action=NfcJSONMessage.LAST_CONNECTED_CARD_ACTIVITY,
                             data=message.data,
                             status=status.HTTP_200_OK,
                             request_id=request_id)  # Also pass the request ID

    @last_connected_card_activity.serializer
    def last_connected_card_activity(self,
                                     instance: LastConnectedCard,
                                     action,
                                     **kwargs) -> LastConnectedCardSerializer:
        """
        Serialize a database instance.

        :param instance: Model instance after databse update
        :param action: Not used
        :return: Serializer instance
        """
        return LastConnectedCardSerializer(instance)

    @action()
    async def subscribe_to_last_connected_card_activity(self,
                                                        request_id,
                                                        **kwargs) -> None:
        """
        Subscribe to the ModelObserver.

        :param request_id: ID of websocket request
        """
        await self.last_connected_card_activity.subscribe(request_id=request_id)


class SyncNfcConsumer(JsonWebsocketConsumer):
    """Synchronous NfcConsumer (does not register changes to LastConnectedCard, so not used anymore"""

    def __init__(self, *args, **kwargs) -> None:
        """
        Show the currently connected NFC card status and can link username to a NFC card.
        """
        super().__init__(*args, **kwargs)

    def connect(self) -> None:
        print("Connecting")
        self.accept()
        self.send_json({
            "type": "welcome_message",
            "data": "Successfully connected!",
            "success": True
        })

    def disconnect(self, code) -> None:
        print("Disconnecting")
        return super(SyncNfcConsumer, self).disconnect(code=code)

    def receive_json(self, content: dict, **kwargs) -> None:
        """Receive a JSON message from the websocket client"""
        message_type: str = content.get("type", None)
        print(content)

        if message_type == "get-last-connected-card":
            seconds: Optional[int] = content.get("seconds", None)  # Extract the seconds, default to None
            if seconds is not None:  # If seconds was passed, convert it to an integer
                seconds = int(seconds)

            try:
                last_card = LastConnectedCard.objects.get()
                if last_card.was_connected_recently(seconds=seconds):  # If card was connected recently, send the card
                    last_card_serializer = LastConnectedCardSerializer(last_card)
                    self.send_json({
                        "type": "last-connected-card",
                        "data": last_card_serializer.data,
                        "success": True
                    })
                else:  # Card was not connected recently, move along to send error
                    pass

            except LastConnectedCard.DoesNotExist:  # If no card was connected yet, move along to send error
                pass

            # Card was not found or was not connected recently enough according to the seconds parameter, send error
            self.send_json({
                "type": "last-connected-card",
                "data": "not found",
                "success": False
            })

        elif message_type == "get-user-nfc-card":
            username: Optional[str] = content.get("username", None)  # Username from message
            try:
                user_nfc_card = UserNfcCard.objects.get(username=username)  # Get from database
                user_nfc_card_serializer = UserNfcCardSerializer(user_nfc_card)  # Convert to JSON format
                self.send_json({
                    "type": "user-nfc-card",
                    "data": user_nfc_card_serializer.data,
                    "success": True
                })
            except UserNfcCard.DoesNotExist:  # This username does not exist in the database, send error
                pass

            # Username has no card associated, send None
            self.send_json({
                "type": "user-nfc-card",
                "data": "not found",
                "success": False
            })

        elif message_type == "update-user-nfc-card":
            username: Optional[str] = content.get("username", None)  # Username from message
            data: Optional[str] = content.get("data", None)  # Creation or update information from message
            try:
                user_nfc_card = UserNfcCard.objects.get(username=username)  # Get from database
                # If this user already exists in database, update the existing entry
                user_nfc_card_serializer = UserNfcCardSerializer(user_nfc_card, data=data)

            except UserNfcCard.DoesNotExist:  # If username is not in database, create new entry
                user_nfc_card_serializer = UserNfcCardSerializer(data=data)

            if user_nfc_card_serializer.is_valid():  # Check if data provided is valid
                user_nfc_card_serializer.save()  # Commit to database
                self.send_json({
                    "type": "user-nfc-card",
                    "data": user_nfc_card_serializer.data,
                    "success": True
                })
            else:  # Data was invalid, send the errors
                self.send_json({
                    "type": "user-nfc-card",
                    "data": user_nfc_card_serializer.errors,
                    "success": False
                })

        elif message_type == "delete-user-nfc-card":
            username: Optional[str] = content.get("username", None)  # Username from message
            try:
                user_nfc_card = UserNfcCard.objects.get(username=username)
                user_nfc_card.delete()
                self.send_json({
                    "type": "user-nfc-card",
                    "data": "deleted",
                    "success": True
                })
            except UserNfcCard.DoesNotExist:
                self.send_json({
                    "type": "user-nfc-card",
                    "data": "not found",
                    "success": False
                })

        else:
            print("unknown message")

        return super().receive_json(content=content, **kwargs)
