"""Streeplijst3 URL Configuration

The `urlpatterns` list streeplijstRoutes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from channels.routing import URLRouter
from django.contrib import admin
from django.urls import path, include

from nfc.urls import websocket_urlpatterns

urlpatterns = [
    path('', include('frontend.urls')),
    path('streeplijst/', include('streeplijst.urls')),
    path('nfc/', include('nfc.urls')),
    path('admin/', admin.site.urls),
]

websocket_urlpatterns = URLRouter([
    path('ws/', URLRouter([  # Outer URL pattern which encapsulates all websocket connections
        path('nfc/', websocket_urlpatterns)  # NFC app websocket url
    ]))
])
