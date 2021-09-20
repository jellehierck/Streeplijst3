import os
import requests

from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.response import Response

from streeplijst.congressus.api import get_members, get_products, get_sales, get_member_id


@api_view(['GET'])
def members(req: Request) -> Response:
    """
    Get all members from Congressus. See https://docs.congressus.nl/#!/default/get_members for query parameters.

    :param req: Request object.
    :param extra_params: Extra request parameters.
    """
    return get_members(req)


@api_view(['GET'])
def members_by_username(req: Request, username: str) -> Response:
    """
    Get a specific member from Congressus. Uses the username query (https://docs.congressus.nl/#!/default/get_members).
    Note that we still return a list containing only one object.

    :param req: Request object.
    :param username: Username to search for.
    """
    return get_members(req, extra_params={'username': username})


@api_view(['GET'])
def products(req: Request) -> Response:
    """
    Get all products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

    :param req: Request object.
    """
    return get_products(req)


@api_view(['GET'])
def products_by_folder_id(req: Request, folder_id: int) -> Response:
    """
    Get all products in a specific folder. Uses the folder_id query (https://docs.congressus.nl/#!/default/get_members).

    :param req: Request object.
    :param folder_id: Folder ID to search for.
    """
    return get_products(req, extra_params={'folder_id': folder_id})


@api_view(['GET'])
def sales_by_username(req: Request, username: str = None) -> Response:
    """
    Get all sales of a specific user. Uses the member_id query (https://docs.congressus.nl/#!/default/get_sales).

    :param req: Request object.
    :param username: Username to search for.
    """
    member_id = get_member_id(username=username)
    return get_sales(req, extra_params={'member_id': member_id})
