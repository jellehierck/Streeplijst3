from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, parser_classes

from streeplijst.congressus import api_v20
from streeplijst.congressus import api_v30
from streeplijst.congressus.api import ApiV30

api_v30_obj = ApiV30()  # TODO: Move this so it is not a module variable


@api_view(['GET'])
def ping(req: Request, version: str) -> Response:
    """
    Get a ping message from the backend server.

    :param req: Request object.
    :param version: API version.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.ping()

    # if version == api_v20.URL_PREFIX:
    #     return api_v20.get_ping()
    # if version == api_v30.URL_PREFIX:
    #     return api_v30.get_ping()


@api_view(['GET'])
def members(req: Request) -> Response:
    """
    Get all members from Congressus. See https://docs.congressus.nl/#!/default/get_members for query parameters.

    :param req: Request object.
    """
    # return get_members(req)
    pass


@api_view(['GET'])
def member_by_id(req: Request, version: str, id: int) -> Response:
    """
    Get a specific member from Congressus by their internal Congressus ID.

    :param req: Request object.
    :param version: API version to use
    :param id: ID to use.
    """
    print('member_by_id')
    if version == ApiV30.API_VERSION:
        return api_v30_obj.get_member_by_id(id=id)
        # return get_members(req, extra_params={'username': username})


@api_view(['GET'])
def member_by_username(req: Request, version: str, username: str) -> Response:
    """
    Get a specific member from Congressus by their username.

    :param req: Request object.
    :param version: API version to use
    :param username: Username to search for.
    """
    print('member_by_username')
    if version == ApiV30.API_VERSION:
        return api_v30_obj.get_member_by_username(username=username)
    # return get_members(req, extra_params={'username': username})


@api_view(['GET'])
def products(req: Request) -> Response:
    """
    Get all products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

    :param req: Request object.
    """
    pass
    # return get_products(req)


@api_view(['GET'])
def products_by_folder_id(req: Request, folder_id: int) -> Response:
    """
    Get all products in a specific folder. Uses the folder_id query (https://docs.congressus.nl/#!/default/get_members).

    :param req: Request object.
    :param folder_id: Folder ID to search for.
    """
    pass
    # return get_products(req, extra_params={'folder_id': folder_id})


@api_view(['GET'])
def sales_by_username(req: Request, username: str = None) -> Response:
    """
    Get all sales of a specific user. Uses the member_id query (https://docs.congressus.nl/#!/default/get_sales).

    :param req: Request object.
    :param username: Username to search for.
    """
    pass
    # member_id = get_member_id(username=username)
    # return get_sales(req, extra_params={'member_id': member_id})


@api_view(['POST'])
def sales(req: Request) -> Response:
    pass

    # member_id = req.data['member_id']
    # # product_offer_id = req.data['product_offer_id']
    # # quantity = req.data['quantity']
    # items = req.data['items']
    # return post_sale(member_id=member_id, items=items)
    # # product_offer_id=product_offer_id, quantity=quantity)
