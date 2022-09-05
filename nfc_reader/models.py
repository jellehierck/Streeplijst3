from datetime import datetime as DateTime, timedelta as TimeDelta, timezone as TimeZone  # Rename to python-like classes
from typing import Optional

from django.db import models


# Create your models here.
class UserNfcCard(models.Model):
    """Connection between a user and a NFC card"""
    username = models.CharField(max_length=8, primary_key=True)  # Username as stored in Congressus
    card_uid = models.CharField(max_length=20, unique=True)  # Card UID stored as hex, e.g. "00 00 00 00 00 00 00"
    added = models.DateTimeField(auto_now_add=True)  # When this card was added, set automatically

    def __str__(self) -> str:
        return f"<{self.__class__.__name__} {self.username} ({self.added.strftime('%Y-%m-%d %H:%M:%S')})>"


class LastConnectedCard(models.Model):
    """
    Database table which holds only a single row, to keep track of the last card connected to the reader.
    NB: This is likely not a very sensible approach but it is guaranteed thread-safe.
    """
    card_uid = models.CharField(max_length=20)  # Card UID stored as hex, e.g. "00 00 00 00 00 00 00"
    currently_connected = models.BooleanField(default=True)  # Whether the card is currently connected
    connected = models.DateTimeField()  # When this card was connected

    def save(self, *args, **kwargs) -> None:
        """
        Override the save method so that only one row can be present at any time.
        Based on: https://stackoverflow.com/a/60274685
        """
        self.pk = 1  # Ensures every saved card always overwrites any previous card due to having the same primary key
        if self._state.adding is True:  # Only set the connected timestamp when a new card is connected, not for update
            self.connected = DateTime.now()
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False) -> None:
        """
        Override the delete method so that it never deletes an entry in the list but instead sets the
        currently_connected flag to False.
        """
        self.currently_connected = False
        self.save()

    def was_connected_recently(self, seconds: Optional[int] = 10) -> bool:
        """
        Whether the card was connected recently.

        :param seconds: How many seconds is considered recent. If None is passed, this method always returns True
        """
        if seconds is None:
            return True
        else:
            now = DateTime.now(tz=TimeZone.utc)
            return self.connected + TimeDelta(seconds=seconds) >= now

    def __str__(self) -> str:
        connected_str = "connected" if self.currently_connected else "not connected"
        return f"<{self.__class__.__name__} {self.card_uid} ({connected_str})>"
