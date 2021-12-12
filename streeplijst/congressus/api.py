import os

import requests
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from streeplijst.congressus.utils import strip_member_data, strip_product_data, strip_sales_data

CONGRESSUS_API_URL_BASE = "https://api.congressus.nl/v20"
CONGRESSUS_NEW_API_URL_BASE = "https://api.congressus.nl/v30"

CONGRESSUS_HEADERS = {
    'Authorization': 'Bearer ' + os.environ.get('CONGRESSUS_API_TOKEN')
}

MAX_RETRIES = 3

TIMEOUT = 10


def _make_congressus_api_call(method: str, url_endpoint: str, params: dict = None, data: dict = None) -> Response:
    """
    Make an API call to Congressus. Tries up to MAX_RETRIES times to get a response withing TIMEOUT seconds. If no
    response returned in that time, a Response is returned with error code HTTP_408_REQUEST_TIMEOUT.

    :param method: Method to obtain. Must be 'get' or 'post'.
    :param url_endpoint: URL endpoint to call. Example: '/members'
    :param params: Optional parameters to add as a query.
    :param data: Optional data to send with a POST request. Is converted from a dict to JSON.
    :return: A Response object.
    """
    retries = 0
    while retries < MAX_RETRIES:  # Attempt to get a response a number of times
        try:
            res = requests.request(method=method,
                                   url=CONGRESSUS_API_URL_BASE + url_endpoint,
                                   headers=CONGRESSUS_HEADERS,
                                   params=params,
                                   json=data,
                                   timeout=TIMEOUT)
            # Return the response from the API server converted to a rest_framework.Response object
            return Response(data=res.json(),
                            status=res.status_code,
                            headers=res.headers,
                            content_type=res.headers['content-type'])

        except requests.exceptions.Timeout:  # If the request timed out
            retries += 1  # Increment the number of retries

    # If the number of retries is exceeded, return a response with an error code
    return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)


def get_members(req: Request = None, extra_params: dict = None) -> Response:
    """
    Get members from Congressus. See http://docs.congressus.nl/#!/default/get_members for query parameters.

    :param req: Request object.
    :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
    """
    params = dict()
    # Alter params according to the input parameters
    if req:
        params = req.query_params.copy()  # Copy the existing params to a mutable copy
    if extra_params:  # If extra params were provided
        params.update(extra_params)  # Add extra params to the existing params

    res = _make_congressus_api_call(method='get',
                                    url_endpoint='/members',
                                    params=params)

    if status.is_success(res.status_code):  # Request is ok
        raw_data = res.data
        stripped_data = list()
        for raw_member_data in raw_data:
            stripped_data.append(strip_member_data(raw_member_data=raw_member_data))
        return Response(stripped_data, status=res.status_code)

    else:  # Status indicated a failure
        return res


def get_member_id(username: str) -> int:
    """
    Get a member id by their username.
    """
    res = get_members(extra_params={'username': username})
    if status.is_success(res.status_code):  # Request is ok
        raw_data = res.data
        if raw_data:
            return raw_data[0]['id']

    # Status indicated a failure or no user was found
    return 0


def get_products(req: Request, extra_params: dict = None) -> Response:
    """
    Get products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

    :param req: Request object.
    :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
    """
    params = req.query_params.copy()
    if extra_params:  # If extra params were provided
        params.update(extra_params)  # Add extra params to the existing params

    res = _make_congressus_api_call(method='get',
                                    url_endpoint='/products',
                                    params=params)

    if status.is_success(res.status_code):  # Request is ok
        raw_data = res.data
        stripped_data = list()
        for raw_product_data in raw_data:
            stripped_data.append(strip_product_data(raw_product_data=raw_product_data))
        return Response(stripped_data, status=res.status_code)

    else:  # Status indicated a failure
        return res


def get_sales(req: Request, extra_params: dict = None) -> Response:
    """
    Get sales from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

    :param req: Request object.
    :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
    """
    params = req.query_params.copy()
    if extra_params:  # If extra params were provided
        params.update(extra_params)  # Add extra params to the existing params

    res = _make_congressus_api_call(method='get',
                                    url_endpoint='/sales',
                                    params=params)

    if status.is_success(res.status_code):  # Request is ok
        raw_data = res.data
        stripped_data = list()
        for raw_sale_data in raw_data:
            stripped_data.append(strip_sales_data(raw_sales_data=raw_sale_data))
        return Response(stripped_data, status=res.status_code)

    else:  # Status indicated a failure
        return res


def post_sale(member_id: int, items):
    """
        QUICK AND DIRTY FIX TO USE THE NEW API ONLY FOR POSTING PLS FIX THIS
    """
    payload = {  # Store the sales parameters in the format required by Congressus
        "member_id": member_id,  # User id (not username)
        "items": items
    }

    method='post'
    retries = 0
    while retries < MAX_RETRIES:  # Attempt to get a response a number of times
        print("trying");
        try:
            res = requests.request(method='post',
                                   url=CONGRESSUS_NEW_API_URL_BASE + "/sale-invoices",
                                   headers=CONGRESSUS_HEADERS,
                                   params=None,
                                   json=payload,
                                   timeout=TIMEOUT)
            
            print("returning!!")
            # Return the response from the API server converted to a rest_framework.Response object
            return Response(data=res.json(),
                            status=res.status_code,
                            # headers={k:v for k,v in res.headers.items() if "Connection" not in k},
                            content_type=res.headers['content-type'])

        except requests.exceptions.Timeout:  # If the request timed out
            retries += 1  # Increment the number of retries

    # If the number of retries is exceeded, return a response with an error code
    return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)
