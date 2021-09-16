from django.urls import path

from streeplijst import views

app_name = 'streeplijst'
urlpatterns = [
    path('members/', views.members, name='members'),
    path('members/<str:username>', views.members_username, name='members_username'),
]
