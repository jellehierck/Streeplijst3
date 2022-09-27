from channels.routing import URLRouter
from django.urls import path

from nfc import consumers
from nfc import views

app_name = 'nfc'

# URL patterns for REST API
urlpatterns = [
    path("", views.AllNfcCardsAPIView.as_view(), name="all-nfc-cards"),
    path("last-connected-card", views.LastConnectedNfcCardAPIView.as_view(), name="last-connected-card"),
    path("<str:username>", views.NfcCardAPIView.as_view(), name="nfc-card"),
]

# URL patterns for WebSockets
websocket_urlpatterns = URLRouter([
    # path("", consumers.NfcConsumer.as_asgi(), name="all-nfc-cards"),
    path("", consumers.NfcConsumer.as_asgi(), name="last-connected-card"),
])
