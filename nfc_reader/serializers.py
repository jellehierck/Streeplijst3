from rest_framework import serializers

from nfc_reader.models import UserNfcCard, LastConnectedCard


class UserNfcCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNfcCard
        fields = '__all__'


class LastConnectedCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LastConnectedCard
        exclude = ["id"]
