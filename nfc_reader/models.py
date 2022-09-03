from django.db import models


# Create your models here.
class UserNfcCard(models.Model):
    """Connection between a user and a NFC card"""
    username = models.CharField(max_length=8, primary_key=True)  # Username as stored in Congressus
    card_uid = models.CharField(max_length=20, unique=True)  # Card UID stored as hex, e.g. "00 00 00 00 00 00 00"
    added = models.DateTimeField(auto_now_add=True)  # When this card was added, set automatically

    def __str__(self) -> str:
        return f"<{self.__class__.__name__} {self.username} ({self.added.strftime('%Y-%m-%d %H:%M:%S')})>"
