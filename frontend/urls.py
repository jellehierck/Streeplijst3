from django.urls import path
from frontend import views

urlpatterns = [
    path('', views.index),
    path('csrf/', views.csrf),
    path('ping/', views.ping),
]
