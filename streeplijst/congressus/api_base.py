import abc  # Abstract Base Class package
from typing import Tuple

from rest_framework.request import Request
from rest_framework.response import Response


class ApiBase:
    CONGRESSUS_MAX_RETRIES: int = 2  # Max number of retries for any call to Congressus API
    CONGRESSUS_TIMEOUT: int = 10  # Seconds before a request to Congressus API times out

    @property
    def _congressus_url_base(self) -> str:
        """Returns the base URL for making calls to Congressus API"""
        return f"https://api.congressus.nl/{self.version}"

    @property
    @abc.abstractmethod
    def _congressus_headers(self) -> dict[str, str]:
        """Returns the congressus authorization headers."""
        pass

    @property
    @abc.abstractmethod
    def version(self) -> str:
        """Returns the api version."""
        pass

    def ping(self, req: Request) -> Response:
        """Ping the local server."""
        ping_data = {'message': f"Ping to local API {self.version} successful"}
        return Response(data=ping_data)

    @abc.abstractmethod
    def list_members(self, req: Request, extra_params: dict = None) -> Response:
        """
        Get multiple members from Congressus.
        :param req:
        :param extra_params:
        """
        pass

    @abc.abstractmethod
    def get_member_by_id(self, req: Request, id: int) -> Response:
        """
        Get a member by their internal Congressus ID. When getting a member by username, use 'get_member_by_username'
        instead.
        :param req: Original request.
        :param id:
        """
        pass

    @abc.abstractmethod
    def get_member_by_username(self, req: Request, username: str) -> Response:
        """
        Get a member by their username.
        :param req: Original request.
        :param username:
        """
        pass

    @abc.abstractmethod
    def list_products(self, req: Request, extra_params: dict = None) -> Response:
        """
        Get products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

        :param req: Original request. Request object.
        :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
        """
        pass

    @abc.abstractmethod
    def list_streeplijst_folders(self, req: Request) -> Response:
        """
        Get all folders from Congressus linked to the Streeplijst specification. TODO: Add way to store which folders to
        retrieve
        :param req: Original request.
        """
        pass

    @abc.abstractmethod
    def list_products_in_folder(self, req: Request, folder_id: int) -> Response:
        """
        Get all products in a specific folder.
        :param req: Original request.
        :param folder_id:
        """

    @abc.abstractmethod
    def get_sales_by_username(self, req: Request, username: str, invoice_status: str = None, invoice_type: str = None,
                              period_filter: str = None, product_offer_id: list[str] = None, category: str = None,
                              order: str = None) -> Response:
        """
        Get sales for a specific user.

        :param username: Username to filter by user
        :param invoice_status: Filter by invoice status string
        :param invoice_type: Filter by invoice type, defaults to "webshop"
        :param product_offer_id: Filter by product based on product_offer_id
        :param period_filter: Filter by period, defaults to 1 year back
        :param order: Optional order string
        :param req: Original request (not used currently)
        """
        pass

    @abc.abstractmethod
    def get_sales(self, req: Request, usernames: list[str] = None, member_ids: list[int] = None,
                  invoice_status: str = None, invoice_type: str = None, period_filter: str = None,
                  product_offer_id: list[str] = None, category: str = None, order: str = None) -> Response:
        """
        Get sales with some parameters. If a user is searched by username but is not found, sales will not be obtained
        for that user.

        :param usernames: List of usernames to filter by user
        :param member_ids: List of member IDs to filter by user
        :param invoice_status: Filter by invoice status string
        :param invoice_type: Filter by invoice type, basically its status
        :param product_offer_id: Filter by product based on product_offer_id
        :param period_filter: Filter by period, defaults to 1 year back
        :param category: Filter by invoice category, should probably be "webshop"
        :param order: Optional order string
        :param req: Original request (not used currently)
        """
        pass

    @abc.abstractmethod
    def post_sale(self, member_id: int, items, req: Request):
        """
        :param req: Original request.
        :param member_id:
        :param items:
        """
        pass

    @abc.abstractmethod
    def _member_username_to_id(self, username: str) -> Tuple[int, Response]:
        """
        Convert a member username to a member id by searching for the member username on Congressus API. Returns 0 if
        the username could not be found. Always returns the raw Response too.
        """
        pass

    @abc.abstractmethod
    def _strip_member_data(self, raw_member_data: dict) -> dict:
        """
        Strips data from member API response to only include data that is relevant and no unnecessary personal details.

        :param raw_member_data: Raw API response from Congressus.
        :return: A stripped dict only including some details of a user.
        """
        pass

    @abc.abstractmethod
    def _strip_product_data(self, raw_product_data: dict) -> dict:
        """
        Strips data from product API response to only include data that is relevant.

        :param raw_product_data: Raw API response from Congressus.
        :return: A stripped dict only including some details of a product.
        """
        pass

    @abc.abstractmethod
    def _strip_sales_data(self, raw_sales_data: dict):
        """
        Strips data from sales API response to only include data that is relevant.

        :param raw_sales_data: Raw API response from Congressus.
        :return: A stripped dict only including some details of a sale.
        """
        pass
