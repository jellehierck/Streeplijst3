from django.urls import path

from nfc_reader import views

app_name = 'nfc'
urlpatterns = [
    # path("", views.index, name="index")
    path("", views.all_nfc_cards, name="all_nfc_cards"),
    path("<str:username>", views.nfc_card, name="nfc_card"),
]
