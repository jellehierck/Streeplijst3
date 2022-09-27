"""
ASGI config for Streeplijst3 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Streeplijst3.settings')

# This application object is used by any ASGI server configured to use this file.
django_application = get_asgi_application()

# Anything below this line is executed after initial ASGI settings are initialized
from channels.routing import ProtocolTypeRouter
# from nfc.urls import websocket_urlpatterns
from Streeplijst3.urls import websocket_urlpatterns

# This application object is used by the settings.
application = ProtocolTypeRouter({
    "http": django_application,
    "websocket": websocket_urlpatterns,
})
