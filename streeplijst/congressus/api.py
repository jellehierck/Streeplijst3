import abc  # Abstract Base Class package
import datetime
import os
from typing import Dict, List

import requests
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from streeplijst.congressus.utils import STREEPLIJST_PARENT_FOLDER_ID, _extract_keys, STREEPLIJST_FOLDER_CONFIGURATION


class ApiBase:
    CONGRESSUS_MAX_RETRIES: int = 2  # Max number of retries for any call to Congressus API
    CONGRESSUS_TIMEOUT: int = 10  # Seconds before a request to Congressus API times out

    @property
    def _congressus_url_base(self) -> str:
        """Returns the base URL for making calls to Congressus API"""
        return f"https://api.congressus.nl/{self.version}"

    @property
    @abc.abstractmethod
    def _congressus_headers(self) -> Dict[str, str]:
        """Returns the congressus authorization headers."""
        pass

    @property
    @abc.abstractmethod
    def version(self) -> str:
        """Returns the api version."""
        pass

    def ping(self) -> Response:
        """Ping the local server."""
        ping_data = {'message': f"Ping to local API {self.version} successful"}
        return Response(data=ping_data)

    @abc.abstractmethod
    def list_members(self, req: Request = None, extra_params: dict = None) -> Response:
        """
        Get multiple members from Congressus.
        :param req:
        :param extra_params:
        """
        pass

    @abc.abstractmethod
    def get_member_by_id(self, id: int, req: Request = None) -> Response:
        """
        Get a member by their internal Congressus ID. When getting a member by username, use 'get_member_by_username'
        instead.
        :param req: Original request.
        :param id:
        """
        pass

    @abc.abstractmethod
    def get_member_by_username(self, username: str, req: Request = None) -> Response:
        """
        Get a member by their username.
        :param req: Original request.
        :param username:
        """
        pass

    @abc.abstractmethod
    def list_products(self, extra_params: dict = None, req: Request = None) -> Response:
        """
        Get products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

        :param req: Original request. Request object.
        :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
        """
        pass

    @abc.abstractmethod
    def list_streeplijst_folders(self, req: Request = None) -> Response:
        """
        Get all folders from Congressus linked to the Streeplijst specification. TODO: Add way to store which folders to
        retrieve
        :param req: Original request. 
        """
        pass

    @abc.abstractmethod
    def list_products_in_folder(self, folder_id: int, req: Request = None) -> Response:
        """
        Get all products in a specific folder.
        :param req: Original request.
        :param folder_id:
        """

    @abc.abstractmethod
    def get_sales_by_username(self, username: str, invoice_status: str = None, invoice_type: str = None,
                              period_filter: str = None, product_offer_id: List[str] = None, order: str = None,
                              req: Request = None) -> Response:
        """
        Get sales for a specific user

        :param username:
        :param invoice_status:
        :param invoice_type:
        :param product_offer_id:
        :param period_filter:
        :param order:
        :param req: Original request.
        """
        pass

    @abc.abstractmethod
    def post_sale(self, member_id: int, items, req: Request = None):
        """
        :param req: Original request.
        :param member_id:
        :param items:
        """
        pass

    @abc.abstractmethod
    def _member_username_to_id(self, username: str) -> int:
        """
        Convert a member username to a member id by searching for the member username on Congressus API. Returns 0 if
        the username could not be found.
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


class ApiV30(ApiBase):
    API_VERSION = 'v30'

    DEFAULT_INVOICE_TYPE = "webshop"
    DEFAULT_INVOICE_PERIOD_FILTER = datetime.timedelta(weeks=52)  # Default a year back

    @property
    def _congressus_headers(self) -> Dict[str, str]:
        # v30 requires a space between the word Bearer and the token
        return {'Authorization': 'Bearer ' + os.environ.get('CONGRESSUS_API_TOKEN')}

    @property
    def version(self) -> str:
        return self.API_VERSION

    def list_members(self, req: Request = None, extra_params: dict = None) -> Response:
        """
        Deprecated for v30, use 'get_member_by_*' instead.
        """
        message_data = {'message': "It is not allowed to list all members, use a search instead"}
        return Response(data=message_data, status=status.HTTP_403_FORBIDDEN)

    def get_member_by_id(self, id: int, req: Request = None) -> Response:
        res = self._congressus_api_call_single(method='get',
                                               url_endpoint=f'/members/{id}')
        if status.is_success(res.status_code):  # Request is ok
            stripped_data = self._strip_member_data(res.data)  # Strip the raw data
            return Response(data=stripped_data, status=res.status_code)
        else:  # Response status indicated a failure
            return res

    def get_member_by_username(self, username: str, req: Request = None) -> Response:
        member_id = self._member_username_to_id(username=username)  # Get member ID
        if member_id == 0:  # No user was found
            error_data = {'message': f"No user found for {username}"}
            return Response(data=error_data, status=status.HTTP_404_NOT_FOUND)

        else:  # A user was found, get details of that user
            return self.get_member_by_id(id=member_id, req=req)

    def list_products(self, extra_params: dict = None, req: Request = None) -> Response:
        """
        Deprecated for v30, use 'list_products_*' instead.
        """
        message_data = {'message': "It is not allowed to list all products, list them by folders instead"}
        return Response(data=message_data, status=status.HTTP_403_FORBIDDEN)

    def list_streeplijst_folders(self, req: Request = None) -> Response:
        res = self._congressus_api_call_pagination(method='get',
                                                   url_endpoint='/product-folders',
                                                   query_params={'parent_id': STREEPLIJST_PARENT_FOLDER_ID})
        # TODO: Add image files to folders (image urls are not included in Congressus API response)
        return res

    def list_products_in_folder(self, folder_id: int, req: Request = None) -> Response:
        res = self._congressus_api_call_pagination(method='get',
                                                   url_endpoint='/products',
                                                   query_params={'folder_id': folder_id})  # Add the folder_id
        if status.is_success(res.status_code):  # Request is ok
            stripped_products_array = []  # Empty array of stripped products
            for product in res.data:  # Iterate all products in the response
                stripped_products_array.append(
                    self._strip_product_data(raw_product_data=product))  # Strip product data
            return Response(data=stripped_products_array, status=res.status_code)  # Return response
        else:  # Response status indicated a failure
            return res  # Return result with failure information

    def get_sales_by_username(self, username: str, invoice_status: str = None, invoice_type: str = None,
                              period_filter: str = None, product_offer_id: List[str] = None, order: str = None,
                              req: Request = None) -> Response:
        # message_data = {'message': f"Not supported in local API {self.version} (yet)"}
        # return Response(data=message_data, status=status.HTTP_403_FORBIDDEN)

        if not invoice_type:  # If invoice type is not given, use the default
            invoice_type = self.DEFAULT_INVOICE_TYPE
        if not period_filter:  # If the period is not given, use the default
            curr_date = datetime.date.today()  # Get current date
            period_time = curr_date - self.DEFAULT_INVOICE_PERIOD_FILTER  # Go back default time
            period_filter = period_time.strftime("%Y-%m-%d")  # Convert to string in specific format

        member_id = self._member_username_to_id(username)  # First convert the username to a member ID
        params = {  # Store the request parameters in the format required by Congressus
            "member_id": member_id,  # User id (not username)
            "invoice_status": invoice_status,  # Optional filter for invoice status
            "invoice_type": invoice_type,  # Type of invoice TODO: Make this configurable, not hardcoded?
            "period_filter": period_filter,  # Period filter to request
            "product_offer_id": product_offer_id,  # List of items
            "order": order
        }

        # Make request
        res = self._congressus_api_call_pagination(method='get',
                                                   url_endpoint='/sale-invoices',
                                                   query_params=params)
        if status.is_success(res.status_code):  # Request is ok
            stripped_sales_array = []  # Empty array of stripped sales
            for sale in res.data:  # Iterate all sales in the response
                stripped_sales_array.append(self._strip_sales_data(raw_sales_data=sale))  # Strip sale data
            return Response(data=stripped_sales_array, status=res.status_code)  # Return response
        else:  # Response status indicated a failure
            return res  # Return result with failure information

    def post_sale(self, member_id: int, items, req: Request = None):
        payload = {  # Store the sales parameters in the format required by Congressus
            "member_id": member_id,  # User id (not username)
            "items": items,  # List of items
            "invoice_type": "webshop"  # Type of invoice so we can filter TODO: Make this configurable, not hardcoded?
        }
        res = self._congressus_api_call_single(method='post',
                                               url_endpoint='/sale-invoices',
                                               payload=payload)
        if status.is_success(res.status_code):  # Request is OK
            stripped_data = self._strip_sales_data(raw_sales_data=res.data)  # Strip sale data
            return Response(data=stripped_data, status=res.status_code)  # Return response
        else:  # Response status indicated a failure
            return res  # Return result with failure information

    def _congressus_api_call_single(self, method: str, url_endpoint: str, query_params: dict = None,
                                    payload: dict = None, timeout: int = None, max_retries: int = None) -> Response:
        """
        Make a call to the Congressus API where only a single response is expected (no pagination).

        If no response is received from Congressus within timeout seconds for retries times, a Response is returned
        with error code HTTP_408_REQUEST_TIMEOUT.

        All response headers are stripped.

        :param method: Method to obtain. Must be 'get' or 'post'
        :param url_endpoint: URL endpoint to call. Example: '/members'
        :param query_params: Optional additional parameters to add as a query.
        :param payload: Optional data to send with a POST request. Is converted from a dict to JSON.
        :param timeout: Timeout in seconds, defaults to self.CONGRESSUS_TIMEOUT.
        :param max_retries: Number of retries in case of a timeout, defaults to self.CONGRESSUS_MAX_RETRIES.
        :return: A Response object.
        """
        if timeout is None:
            timeout = self.CONGRESSUS_TIMEOUT
        if max_retries is None:
            max_retries = self.CONGRESSUS_MAX_RETRIES

        # Attempt making the request, taking into account the timeout and retries limits
        retries = 0
        while retries < max_retries:  # Attempt to get a response a number of times
            try:
                curr_res = requests.request(method=method,
                                            url=self._congressus_url_base + url_endpoint,
                                            headers=self._congressus_headers,
                                            params=query_params,
                                            json=payload,
                                            timeout=timeout)
                curr_res_data = curr_res.json()  # Convert data to a python dict

                # Return the response from the API server converted to a rest_framework.Response object
                return Response(data=curr_res_data,  # Return the current response data
                                status=curr_res.status_code,  # Copy the status code
                                )
            except requests.exceptions.Timeout:  # If the request timed out
                retries += 1  # Increment the number of retries

        # If the number of retries is exceeded, return a response with an error code
        return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)

    def _congressus_api_call_pagination(self, method: str, url_endpoint: str, page_size: int = 25,
                                        query_params: dict = None, payload: dict = None, timeout: int = None,
                                        max_retries: int = None) -> Response:
        """
        Make a call to the Congressus API where a paginated response is expected. The paginated data will be combined
        into one array, the returned Response will contain all combined data.

        For every page, a timeout and number of retries is set. If no response is received from Congressus within
        timeout seconds for retries times, a Response is returned with error code HTTP_408_REQUEST_TIMEOUT.

        All response headers are stripped.

        :param method: Method to obtain. Must be 'get' or 'post'
        :param url_endpoint: URL endpoint to call. Example: '/members'
        :param page_size: Optional page size for paginated responses.
        :param query_params: Optional additional parameters to add as a query.
        :param payload: Optional data to send with a POST request. Is converted from a dict to JSON.
        :param timeout: Timeout in seconds, defaults to self.CONGRESSUS_TIMEOUT.
        :param max_retries: Number of retries in case of a timeout, defaults to self.CONGRESSUS_MAX_RETRIES.
        :return: A Response object.
        """
        if timeout is None:
            timeout = self.CONGRESSUS_TIMEOUT
        if max_retries is None:
            max_retries = self.CONGRESSUS_MAX_RETRIES

        params = {'page_size': page_size}  # Create dict for query params to send with the request
        if query_params:  # If extra params were provided
            params.update(query_params)  # Add extra params to the existing params

        # Run a loop to make continuous calls to Congressus in case a response contains pagination
        retries = 0  # Retries are restartTimer after Congressus returns a successful response (i.e. after every page)
        curr_page = 1  # Start at page 1
        total_res_data = []  # Instantiate empty list to hold all combined data in case of pagination
        while retries < max_retries:  # Get responses until the number of retries is met or restartTimer
            params.update({'page': curr_page})  # Add updates pagination options

            # Attempt making the request, taking into account the timeout limit and max number of retries
            try:  # Try to make the request and catch in case of a timeout
                curr_res = requests.request(method=method,
                                            url=self._congressus_url_base + url_endpoint,
                                            headers=self._congressus_headers,
                                            params=params,
                                            json=payload,
                                            timeout=timeout)
                curr_res_data = curr_res.json()  # Convert data to a python dict

                # Check if there is an error in the response and return that error response
                if not status.is_success(curr_res.status_code):
                    # Return the response from the API server converted to a rest_framework.Response object
                    return Response(data=curr_res_data,  # Return the error response data
                                    status=curr_res.status_code,  # Copy the status code
                                    )
                # Check that the response actually has pagination, indicated by having a field 'data'
                if 'data' not in curr_res_data:  # There is no pagination, return the current response
                    # Return the response from the API server converted to a rest_framework.Response object
                    return Response(data=curr_res_data,  # Return the current response data
                                    status=curr_res.status_code,  # Copy the status code
                                    )
                # The result has pagination, add the result contents to the running total
                total_res_data += curr_res_data['data']  # Get the data array and add to running total

                # Check that there are further pages to request
                if curr_res_data['has_next'] is False:  # No further pages to request
                    return Response(data=total_res_data,  # Return the total array with data
                                    status=curr_res.status_code,  # Copy the last results status code
                                    )
                else:  # There are more pages in the request, loop again
                    retries = 0  # Reset number of retries
                    curr_page += 1  # Increment the current page

            except requests.exceptions.Timeout:  # If the request timed out, return an error
                retries += 1  # Increment number of retries

        # If the while loop is exited, at some point there were too many timeouts and an error should be returned
        return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)

    def _member_username_to_id(self, username: str) -> int:
        # Make API call with pagination as we have to perform a search
        res = self._congressus_api_call_pagination(method='get',
                                                   url_endpoint='/members/search',
                                                   query_params={'term': username})  # Add a search term
        if status.is_success(res.status_code):  # Request is ok
            # /search likely returns more than one member, select only the member with the correct username
            # Source: https://stackoverflow.com/a/7079297
            correct_member = next((member for member in res.data if member['username'] == username), None)
            if correct_member:  # An exact match for the username was found
                # A call to /search gives a simplified user overview, we need to request all user data and return that
                return correct_member['id']

            else:  # No exact match for the username was found, return an error
                return 0

        else:  # Response status indicated a failure
            return 0  # Return result with failure information

    def _strip_member_data(self, raw_member_data: dict) -> dict:
        keys_to_transfer = [
            'id',  # Internal congressus ID
            'username',  # Username (student number)
            'first_name',  # First name (or names, in case someone has multiple first names)
            'last_name',  # Last name (or names, in case someone has multiple last names)
            'prefix',  # Name prefix (e.g. "Prof. dr.")
            'suffix',  # Name suffix (e.g. "MSc.")
            'date_of_birth',  # Date of birth for 18+ checking
            'show_almanac',  # Whether this user wants to show their information on the website
            'status',  # Current membership status TODO: Check if user has valid status
            'bank_account'  # All banking information TODO: Remove this and only extract sdd mandate, if necessary
        ]
        stripped_data = _extract_keys(raw_member_data, keys_to_transfer)
        return stripped_data

    def _strip_product_data(self, raw_product_data: dict) -> dict:
        keys_to_transfer = [
            'id',  # Internal congressus ID
            'product_offer_id',  # ID for the product offer (variant)
            'name',  # Product name
            'description',  # Product description
            'published',  # Whether this product is published
            'price',  # Price of product in euros
            'media',  # Media object
        ]
        stripped_data = _extract_keys(from_dict=raw_product_data, keys=keys_to_transfer, default=None)

        # media is an array of nested dicts, strip them to only leave the url to the image file
        if stripped_data['media']:  # If the media is not an empty array
            stripped_data['media'] = stripped_data['media'][0]['url']  # Get a URL to the image for this product
        else:  # If the media is an empty array, set it to None (because this will serialize to null in javascript)
            stripped_data['media'] = None

        return stripped_data

    def _strip_sales_data(self, raw_sales_data: dict) -> dict:
        keys_to_transfer = [
            'id'  # ID of this invoice
            'member_id',  # Member ID this invoice is related to
            'items',  # Array of items in this invoice
            'price_paid',  # Paid amount in euros
            'price_unpaid',  # Unpaid amount in euros
            'invoice_date',  # Date on which invoice was issued to the user
            'invoice_source',  # Invoice source, usually "api"
            'invoice_status',  # Invoice status
            'invoice_type',  # Invoice type, usually "webshop"
            'created',  # Datetime on which invoice was created
            'modified',  # Datetime on which invoice was modified
        ]
        stripped_data = _extract_keys(from_dict=raw_sales_data, keys=keys_to_transfer, default=None)
        return stripped_data


class ApiV20(ApiBase):
    API_VERSION = 'v20'

    @property
    def _congressus_headers(self) -> Dict[str, str]:
        # v20 requires NO space between the word Bearer and the token
        return {'Authorization': 'Bearer:' + os.environ.get('CONGRESSUS_API_TOKEN')}

    @property
    def version(self) -> str:
        return self.API_VERSION

    def list_members(self, req: Request = None, extra_params: dict = None) -> Response:
        params = dict()
        # Alter params according to the input parameters
        if req:
            params = req.query_params.copy()  # Copy the existing params to a mutable copy
        if extra_params:  # If extra params were provided
            params.update(extra_params)  # Add extra params to the existing params

        # Make request to Congressus API
        res = self._congressus_api_call(method='get',
                                        url_endpoint='/members',
                                        query_params=params)

        if status.is_success(res.status_code):  # Request is ok
            raw_data = res.data
            stripped_data = list()
            for raw_member_data in raw_data:
                stripped_data.append(self._strip_member_data(raw_member_data=raw_member_data))
            return Response(data=stripped_data, status=res.status_code)

        else:  # Status indicated a failure
            return res

    def get_member_by_id(self, id: int, req: Request = None) -> Response:
        res = self._congressus_api_call(method='get',
                                        url_endpoint=f'/members/{id}')
        if status.is_success(res.status_code):  # Request is ok
            stripped_data = self._strip_member_data(res.data)  # Strip the raw data
            return Response(data=stripped_data, status=res.status_code)
        else:  # Response status indicated a failure
            return res

    def get_member_by_username(self, username: str, req: Request = None) -> Response:
        res = self.list_members(extra_params={'username': username})

        if status.is_success(res.status_code):  # Request is ok

            # /members likely returns more than one member, select only the member with the correct username
            # Source: https://stackoverflow.com/a/7079297
            correct_member = next((member for member in res.data if member['username'] == username), None)
            if correct_member:  # An exact match for the username was found
                stripped_data = self._strip_member_data(correct_member)  # Strip the raw member data
                return Response(data=stripped_data, status=res.status_code)

            else:  # No exact match for the username was found, return an error
                error_data = {'message': f"No user found for {username}"}
                return Response(data=error_data, status=status.HTTP_404_NOT_FOUND)

        else:  # Response status indicated a failure
            return res

    def list_products(self, extra_params: dict = None, req: Request = None) -> Response:
        params = dict()
        # Alter params according to the input parameters
        if req:
            params = req.query_params.copy()  # Copy the existing params to a mutable copy
        if extra_params:  # If extra params were provided
            params.update(extra_params)  # Add extra params to the existing params

        res = self._congressus_api_call(method='get',
                                        url_endpoint='/products',
                                        query_params=params)

        if status.is_success(res.status_code):  # Request is ok
            raw_data = res.data
            stripped_data = list()
            for raw_product_data in raw_data:
                stripped_data.append(self._strip_product_data(raw_product_data=raw_product_data))
            return Response(stripped_data, status=res.status_code)

        else:  # Status indicated a failure
            return res

    def list_streeplijst_folders(self, req: Request = None) -> Response:
        # Do not make a call to Congressus but only return the local configuration of Streeplijst folders
        return Response(data=STREEPLIJST_FOLDER_CONFIGURATION, status=status.HTTP_200_OK)

    def list_products_in_folder(self, folder_id: int, req: Request = None) -> Response:
        # Return a set of products with the specified folder id
        return self.list_products(extra_params={'folder_id': folder_id})

    def get_sales_by_username(self, username: str, invoice_status: str = None, invoice_type: str = None,
                              period_filter: str = None, product_offer_id: List[str] = None, order: str = None,
                              req: Request = None) -> Response:
        # Getting sales using the API v20 is not supported (it gives unexpected results and queries don't work)
        message_data = {
            'message': f"This action is not supported in Congressus API {self.version}, "
                       f"use local API {ApiV30.API_VERSION} instead."
        }
        return Response(data=message_data, status=status.HTTP_403_FORBIDDEN)

        # The following code should have worked but is not supported by Congressus API v20
        # member_id = self._member_username_to_id(username=username)  # Convert username to member ID to use in search
        # res = self._congressus_api_call(method='get',
        #                                 url_endpoint='/sales',
        #                                 query_params={'member_id': member_id})
        #
        # if status.is_success(res.status_code):  # Request is ok
        #     raw_data = res.data
        #     stripped_data = list()
        #     for raw_sale_data in raw_data:
        #         stripped_data.append(self._strip_sales_data(raw_sales_data=raw_sale_data))
        #     return Response(stripped_data, status=res.status_code)
        #
        # else:  # Status indicated a failure
        #     return res

    def post_sale(self, member_id: int, items, req: Request = None):
        """
        Deprecated for v20, use v30 instead.
        """
        message_data = {
            'message': f"It is not allowed to post sales in local API {self.version}, "
                       f"use local API {ApiV30.API_VERSION} instead"
        }
        return Response(data=message_data, status=status.HTTP_403_FORBIDDEN)

    def _congressus_api_call(self, method: str, url_endpoint: str, query_params: dict = None,
                             payload: dict = None, timeout: int = None, max_retries: int = None) -> Response:
        """
        Make an API call to Congressus. Tries up to MAX_RETRIES times to get a response withing TIMEOUT seconds. If no
        response returned in that time, a Response is returned with error code HTTP_408_REQUEST_TIMEOUT.

        :param method: Method to obtain. Must be 'get' or 'post'
        :param url_endpoint: URL endpoint to call. Example: '/members'
        :param query_params: Optional additional parameters to add as a query.
        :param payload: Optional data to send with a POST request. Is converted from a dict to JSON.
        :param timeout: Timeout in seconds, defaults to self.CONGRESSUS_TIMEOUT.
        :param max_retries: Number of retries in case of a timeout, defaults to self.CONGRESSUS_MAX_RETRIES.
        :return: A Response object.
        """
        if timeout is None:
            timeout = self.CONGRESSUS_TIMEOUT
        if max_retries is None:
            max_retries = self.CONGRESSUS_MAX_RETRIES

        # Attempt making the request, taking into account the timeout and retries limits
        retries = 0
        while retries < max_retries:  # Attempt to get a response a number of times
            try:
                curr_res = requests.request(method=method,
                                            url=self._congressus_url_base + url_endpoint,
                                            headers=self._congressus_headers,
                                            params=query_params,
                                            json=payload,
                                            timeout=timeout)
                curr_res_data = curr_res.json()  # Convert data to a python dict

                # Return the response from the API server converted to a rest_framework.Response object
                return Response(data=curr_res_data,  # Return the current response data
                                status=curr_res.status_code,  # Copy the status code
                                )
            except requests.exceptions.Timeout:  # If the request timed out
                retries += 1  # Increment the number of retries

        # If the number of retries is exceeded, return a response with an error code
        return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)

    def _member_username_to_id(self, username: str) -> int:
        res = self.list_members(extra_params={'username': username})

        if status.is_success(res.status_code):  # Request is ok

            # /members likely returns more than one member, select only the member with the correct username
            # Source: https://stackoverflow.com/a/7079297
            correct_member = next((member for member in res.data if member['username'] == username), None)
            if correct_member:  # An exact match for the username was found
                return correct_member['id']

            else:  # No exact match for the username was found, return an error
                return 0

        else:  # Response status indicated a failure
            return 0

    def _strip_member_data(self, raw_member_data: dict) -> dict:
        keys_to_transfer = [
            'date_of_birth',
            'first_name',
            'has_sdd_mandate',
            'id',
            'primary_last_name_main',
            'primary_last_name_prefix',
            'profile_picture',  # TODO: Profile pictures are not supported in v30, maybe remove here too?
            'show_almanac',
            'status',
            'status_id',
            'username'
        ]
        stripped_data = _extract_keys(raw_member_data, keys_to_transfer)
        return stripped_data

    def _strip_product_data(self, raw_product_data: dict) -> dict:
        keys_to_transfer = [
            'description',
            'folder',
            'folder_breadcrumbs',
            'folder_id',
            'id',
            'media',
            'name',
            'offers',
            'published',
            'url',
        ]
        stripped_data = _extract_keys(raw_product_data, keys_to_transfer)

        # Perform some additional cleaning up
        # media is an array of nested dicts, strip them to only leave the url to the image file
        if stripped_data['media']:  # If the media is not an empty array
            stripped_data['media'] = stripped_data['media'][0]['url']  # Get a URL to the image for this product

        # Offers contain their price as a string, so we convert it to an integer
        if stripped_data['offers']:  # If the offers object is not an empty array
            for offer in stripped_data['offers']:  # Loop al offers
                offer['price'] = int(offer['price'])  # Convert offer to an integer
        return stripped_data

    def _strip_sales_data(self, raw_sales_data: dict):
        keys_to_transfer = [
            'cancelled',
            'created',
            'items',
            'status',
            'id',
            'user_id'
        ]
        stripped_data = _extract_keys(raw_sales_data, keys_to_transfer)

        # Perform some additional cleaning up
        if stripped_data['items']:  # If the items list is not None
            for item in stripped_data['items']:  # Loop all items in the list
                item['price'] = int(item['price'])  # Convert from string to integer
                item['total_price'] = int(item['total_price'])  # Convert from string to integer

        return stripped_data
