from django.shortcuts import render
from django.http import JsonResponse
from django.middleware.csrf import get_token


def csrf(request) -> JsonResponse:
    """Obtain an CSRF token."""
    return JsonResponse({'csrfToken': get_token(request)})


def ping(request) -> JsonResponse:
    """Ping the server."""
    return JsonResponse({'result': 'OK'})


def index(request) -> JsonResponse:
    """Load the React app."""
    return render(request, 'index.html')
