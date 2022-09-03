from django.contrib import admin

# Register your models here.
from nfc_reader.models import UserNfcCard

admin.site.register(UserNfcCard)
