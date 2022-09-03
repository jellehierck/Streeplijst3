from rest_framework import serializers

from nfc_reader.models import UserNfcCard


class UserNfcCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNfcCard
        fields = '__all__'
