from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from streeplijst.congressus.api import ApiV30, ApiV20

api_v30_obj = ApiV30()  # TODO: Move this so it is not a module variable
api_v20_obj = ApiV20()


@api_view(['GET'])
def ping(req: Request, version: str) -> Response:
    """
    Get a ping message from the backend server.

    :param req: Request object.
    :param version: API version to use.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.ping()
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.ping()
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def members(req: Request, version: str) -> Response:
    """
    Get all members from Congressus. See https://docs.congressus.nl/#!/default/get_members for query parameters.

    :param req: Request object.
    :param version: API version to use.
    """
    # return get_members(req)
    if version == ApiV30.API_VERSION:
        return api_v30_obj.list_members(req=req)
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.list_members(req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def member_by_id(req: Request, version: str, id: int) -> Response:
    """
    Get a specific member from Congressus by their internal Congressus ID.

    :param req: Request object.
    :param version: API version to use.
    :param id: ID to use.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.get_member_by_id(id=id, req=req)
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.get_member_by_id(id=id, req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def member_by_username(req: Request, version: str, username: str) -> Response:
    """
    Get a specific member from Congressus by their username.

    :param req: Request object.
    :param version: API version to use.
    :param username: Username to search for.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.get_member_by_username(username=username, req=req)
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.get_member_by_username(username=username, req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def products(req: Request, version: str, ) -> Response:
    """
    Get all products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

    :param req: Request object.
    :param version: API version to use.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.list_products()
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.list_products(req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def products_by_folder_id(req: Request, version:str, folder_id: int) -> Response:
    """
    Get all products in a specific folder.

    :param req: Request object.
    :param version: API version to use.
    :param folder_id: Folder ID to search for.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.list_products_in_folder(folder_id=folder_id, req=req)
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.list_products_in_folder(folder_id=folder_id, req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def folders(req: Request, version: str) -> Response:
    """
    Get all folders of the Streeplijst.

    :param req: Request object.
    :param version: API version to use.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.list_streeplijst_folders(req=req)
    elif version == ApiV20.API_VERSION:
        return api_v20_obj.list_streeplijst_folders(req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def sales_by_username(req: Request, version: str, username: str = None) -> Response:
    """
    Get all sales of a specific user. Uses the member_id query (https://docs.congressus.nl/#!/default/get_sales).

    :param req: Request object.
    :param version: API version to use.
    :param username: Username to search for.
    """
    if version == ApiV30.API_VERSION:
        return api_v30_obj.get_sales_by_username(username=username, req=req)
    if version == ApiV20.API_VERSION:
        return api_v20_obj.get_sales_by_username(username=username, req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def sales(req: Request, version: str) -> Response:
    if version == ApiV30.API_VERSION:
        member_id = req.data['member_id']
        items = req.data['items']
        return api_v30_obj.post_sale(member_id=member_id, items=items, req=req)
    if version == ApiV20.API_VERSION:
        member_id = req.data['member_id']
        items = req.data['items']
        return api_v20_obj.post_sale(member_id=member_id, items=items, req=req)
    else:
        return Response(data={'message': f"API version {version} not recognized"}, status=status.HTTP_404_NOT_FOUND)

    # member_id = req.data['member_id']
    # # product_offer_id = req.data['product_offer_id']
    # # quantity = req.data['quantity']
    # items = req.data['items']
    # return post_sale(member_id=member_id, items=items)
    # # product_offer_id=product_offer_id, quantity=quantity)
