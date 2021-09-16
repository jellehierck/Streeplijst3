import os
import requests

from rest_framework import status
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.response import Response

from streeplijst.congressus import strip_member_data, CONGRESSUS_HEADERS, CONGRESSUS_API_URL_BASE, MAX_RETRIES, TIMEOUT


@api_view(['GET'])
def members(req: Request) -> Response:
    """
    Get all members from Congressus. See http://docs.congressus.nl/#!/default/get_members for query parameters.

    :param req: Request object.
    """
    retries = 0
    while retries < MAX_RETRIES:  # Attempt to get a response a number of times
        try:
            res = requests.get(url=CONGRESSUS_API_URL_BASE + '/members',
                               headers=CONGRESSUS_HEADERS,
                               params=req.query_params,
                               timeout=TIMEOUT)
            if res.status_code == requests.codes.ok:  # Request is ok
                raw_data = res.json()
                stripped_data = list()
                for raw_member_data in raw_data:
                    stripped_data.append(strip_member_data(raw_member_data=raw_member_data))
                return Response(raw_data, status=res.status_code)
            else:  # Status indicated a failure
                return Response({"error": "Request failed"}, status=res.status_code)

        except requests.exceptions.Timeout:  # If the request timed out
            retries += 1  # Increment the number of retries

    # If the request timed out too many times, return the error as a response
    return Response({"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)


@api_view(['GET'])
def members_username(req: Request, username: str) -> Response:
    """
    Get a specific member from Congressus. Uses the username query (http://docs.congressus.nl/#!/default/get_members).

    :param req: Request object.
    :param username: Username to search for.
    """
    retries = 0
    while retries < MAX_RETRIES:  # Attempt to get a response a number of times
        try:
            res = requests.get(url=CONGRESSUS_API_URL_BASE + '/members',
                               headers=CONGRESSUS_HEADERS,
                               params={'username': username},
                               timeout=TIMEOUT)
            if res.status_code == requests.codes.ok:  # Request is ok
                raw_data = res.json()
                stripped_data = list()
                for raw_member_data in raw_data:
                    stripped_data.append(strip_member_data(raw_member_data=raw_member_data))
                return Response(stripped_data, status=res.status_code)
            else:  # Status indicated a failure
                return Response({"error": "Request failed"}, status=res.status_code)

        except requests.exceptions.Timeout:  # If the request timed out
            retries += 1  # Increment the number of retries

    # If the request timed out too many times, return the error as a response
    return Response({"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)
