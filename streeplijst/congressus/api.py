import abc  # Abstract Base Class package
import os

from deprecated import deprecated
from typing import Dict, List

import requests
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response


class ApiBase:
    CONGRESSUS_MAX_RETRIES: int = 3  # Max number of retries for any call to Congressus API
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
    def list_members(self) -> Response:
        """
        Get multiple members from Congressus.
        """
        pass

    @abc.abstractmethod
    def get_member_by_id(self, id: int) -> Response:
        """
        Get a member by their internal Congressus ID. When getting a member by username, use 'get_member_by_username'
        instead.
        """
        pass

    @abc.abstractmethod
    def get_member_by_username(self, username: str) -> Response:
        """
        Get a member by their username.
        """
        pass

    @abc.abstractmethod
    def get_products(self, api_version: str, req: Request, extra_params: dict = None) -> Response:
        """
        Get products from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

        :param api_version: The requested api version.
        :param req: Request object.
        :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
        """
        pass

    @abc.abstractmethod
    def get_sales(self, api_version: str, req: Request, extra_params: dict = None) -> Response:
        """
        Get sales from Congressus. See https://docs.congressus.nl/#!/default/get_products for query parameters.

        :param api_version: The requested api version.
        :param req: Request object.
        :param extra_params: Extra request query parameters. Useful parameters are listed in documentation above.
        """
        pass

    @abc.abstractmethod
    def post_sale(self, api_version: str, member_id: int, items):
        """
        QUICK AND DIRTY FIX TO USE THE NEW API ONLY FOR POSTING PLS FIX THIS
        """
        pass

    @abc.abstractmethod
    def _strip_member_data(self, raw_member_data: dict) -> dict:
        """
        Strips unnecessary raw member data from Congressus API and only returns relevant data.
        :param raw_member_data: Raw data to strip.
        """
        pass

    @abc.abstractmethod
    def _strip_product_data(self, raw_product_data: dict) -> dict:
        """
        Strips unnecessary raw product data from Congressus API and only returns relevant data.
        :param raw_product_data: Raw data to strip.
        """
        pass


class ApiV30(ApiBase):
    API_VERSION = 'v30'

    @property
    def _congressus_headers(self) -> Dict[str, str]:
        # v30 requires a space between the word Bearer and the token
        return {'Authorization': 'Bearer ' + os.environ.get('CONGRESSUS_API_TOKEN')}

    @property
    def version(self) -> str:
        return self.API_VERSION

    def list_members(self) -> Response:
        """
        Deprecated for v30, use 'get_member_by_*' instead.
        """
        message_data = {'message': "It is not allowed to list all members, use a search instead"}
        return Response(data=message_data, status=status.HTTP_403_FORBIDDEN)

    def get_member_by_id(self, id: int) -> Response:
        res = self._congressus_api_call_single(method='get',
                                               url_endpoint=f'/members/{id}')
        if status.is_success(res.status_code):  # Request is ok
            stripped_data = self._strip_member_data(res.data)  # Strip the raw data
            return Response(data=stripped_data, status=res.status_code)
        else:  # Response status indicated a failure
            return res

    def get_member_by_username(self, username: str) -> Response:
        # Make API call with pagination as we have to perform a search
        res = self._congressus_api_call_pagination(method='get',
                                                   url_endpoint=f'/members/search',
                                                   query_params={'term': username})  # Add a search term
        if status.is_success(res.status_code):  # Request is ok
            # /search likely returns more than one member, select only the member with the correct username
            # Source: https://stackoverflow.com/a/7079297
            correct_member = next((member for member in res.data if member['username'] == username), None)
            if correct_member:  # An exact match for the username was found
                # A call to /search gives a simplified user overview, we need to request all user data and return that
                return self.get_member_by_id(id=correct_member['id'])

            else:  # No exact match for the username was found, return an error
                error_data = {'message': f"No user found for {username}"}
                return Response(data=error_data, status=status.HTTP_404_NOT_FOUND)

        else:  # Response status indicated a failure
            return res  # Return result with failure information

    def get_products(self, api_version: str, req: Request, extra_params: dict = None) -> Response:
        params = req.query_params.copy()
        if extra_params:  # If extra params were provided
            params.update(extra_params)  # Add extra params to the existing params

        res = self._make_congressus_api_call(method='get', url_endpoint='/products', query_params=params)

        if status.is_success(res.status_code):  # Request is ok
            raw_data = res.data
            stripped_data = list()
            for raw_product_data in raw_data:
                stripped_data.append(self._strip_product_data(raw_product_data=raw_product_data))
            return Response(stripped_data, status=res.status_code)

        else:  # Status indicated a failure
            return res

    def get_sales(self, api_version: str, req: Request, extra_params: dict = None) -> Response:
        pass

    def post_sale(self, api_version: str, member_id: int, items):
        pass

    def _congressus_api_call_single(self, method: str, url_endpoint: str, query_params: dict = None,
                                    data: dict = None) -> Response:
        # Attempt making the request, taking into account the timeout and retries limits
        retries = 0
        while retries < self.CONGRESSUS_MAX_RETRIES:  # Attempt to get a response a number of times
            try:
                curr_res = requests.request(method=method,
                                            url=self._congressus_url_base + url_endpoint,
                                            headers=self._congressus_headers,
                                            params=query_params,
                                            json=data,
                                            timeout=self.CONGRESSUS_TIMEOUT)
                curr_res_data = curr_res.json()  # Convert data to a python dict

                # Return the response from the API server converted to a rest_framework.Response object
                return Response(data=curr_res_data,
                                status=curr_res.status_code,
                                headers=curr_res.headers,
                                content_type=curr_res.headers['content-type'])

            except requests.exceptions.Timeout:  # If the request timed out
                retries += 1  # Increment the number of retries

        # If the number of retries is exceeded, return a response with an error code
        return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)

    def _congressus_api_call_pagination(self, method: str, url_endpoint: str, page_size: int = 25,
                                        query_params: dict = None, data: dict = None, timeout: int = None,
                                        max_retries: int = None) -> Response:
        """
        Make a call to the Congressus API where a paginated response is expected. The paginated data will be combined
        into one array, the returned Response will contain all combined data.

        For every page, a timeout and number of retries is set. If no response is received from Congressus within
        timeout seconds for retries times, a Response is returned with error code HTTP_408_REQUEST_TIMEOUT.

        :param method: Method to obtain. Must be 'get' or 'post'
        :param url_endpoint: URL endpoint to call. Example: '/members'
        :param page_size: Optional page size for paginated responses.
        :param query_params: Optional additional parameters to add as a query.
        :param data: Optional data to send with a POST request. Is converted from a dict to JSON.
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
        retries = 0  # Retries are reset after Congressus returns a successful response (i.e. after every page)
        curr_page = 1  # Start at page 1
        total_res_data = []  # Instantiate empty list to hold all combined data in case of pagination
        while retries < max_retries:  # Get responses until the number of retries is met or reset
            params.update({'page': curr_page})  # Add updates pagination options

            # Attempt making the request, taking into account the timeout limit and max number of retries
            try:  # Try to make the request and catch in case of a timeout
                curr_res = requests.request(method=method,
                                            url=self._congressus_url_base + url_endpoint,
                                            headers=self._congressus_headers,
                                            params=params,
                                            json=data,
                                            timeout=timeout)
                curr_res_data = curr_res.json()  # Convert data to a python dict

                # Check if there is an error in the response and return that error response
                if not status.is_success(curr_res.status_code):
                    # Return the response from the API server converted to a rest_framework.Response object
                    return Response(data=curr_res_data,  # Return the error response data
                                    status=curr_res.status_code,  # Copy the status code
                                    headers=curr_res.headers,  # Copy the headers
                                    content_type=curr_res.headers['content-type'])  # Set to prevent hop-to-hop errors

                # Check that the response actually has pagination, indicated by having a field 'data'
                if 'data' not in curr_res_data:  # There is no pagination, return the current response
                    # Return the response from the API server converted to a rest_framework.Response object
                    return Response(data=curr_res_data,  # Return the current response data
                                    status=curr_res.status_code,  # Copy the status code
                                    headers=curr_res.headers,  # Copy the headers
                                    content_type=curr_res.headers['content-type'])  # Set to prevent hop-to-hop errors

                # The result has pagination, add the result contents to the running total
                total_res_data += curr_res_data['data']  # Get the data array and add to running total

                # Check that there are further pages to request
                if curr_res_data['has_next'] is False:  # No further pages to request
                    return Response(data=total_res_data,  # Return the total array with data
                                    status=curr_res.status_code,  # Copy the last results status code
                                    headers=curr_res.headers,  # Copy the last results headers
                                    content_type=curr_res.headers['content-type'])  # Set to prevent hop-to-hop errors
                else:  # There are more pages in the request, loop again
                    retries = 0  # Reset number of retries
                    curr_page += 1  # Increment the current page

            except requests.exceptions.Timeout:  # If the request timed out, return an error
                retries += 1  # Increment number of retries

        # If the while loop is exited, at some point there were too many timeouts and an error should be returned
        return Response(data={"error": "Request timeout"}, status=status.HTTP_408_REQUEST_TIMEOUT)

    def _strip_member_data(self, raw_member_data: dict) -> dict:
        """
        Strips data from member API response to only include data that is relevant and no unnecessary personal details.

        :param raw_member_data: Raw API response from Congressus.
        :return: A stripped dict only including some details of a user.
        """
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
        pass


class ApiV20(ApiBase):
    API_VERSION = 'v20'

    @property
    def _congressus_headers(self) -> Dict[str, str]:
        # v20 requires NO space between the word Bearer and the token
        return {'Authorization': 'Bearer:' + os.environ.get('CONGRESSUS_API_TOKEN')}

    @property
    def version(self) -> str:
        return self.API_VERSION

    def get_sales(self, api_version: str, req: Request, extra_params: dict = None) -> Response:
        pass

    def post_sale(self, api_version: str, member_id: int, items):
        pass

    def _make_congressus_api_call(self, method: str, url_endpoint: str, query_params: dict = None,
                                  data: dict = None) -> Response:
        """
        Make an API call to Congressus. Tries up to MAX_RETRIES times to get a response withing TIMEOUT seconds. If no
        response returned in that time, a Response is returned with error code HTTP_408_REQUEST_TIMEOUT.

        :param method: Method to obtain. Must be 'get' or 'post'
        :param url_endpoint: URL endpoint to call. Example: '/members'
        :param query_params: Optional additional parameters to add as a query.
        :param data: Optional data to send with a POST request. Is converted from a dict to JSON.
        :return: A Response object.
        """
        pass

    def _strip_member_data(self, raw_member_data: dict) -> dict:
        pass

    def _strip_product_data(self, raw_product_data: dict) -> dict:
        pass


def _extract_keys(from_dict: dict, keys: List[str], default: str = 'error') -> dict:
    """
    Utility function. Transfers a list of keys and their associated values to a new dict.

    :param from_dict: Source dict
    :param keys: List of keys to transfer
    :param default: Default value to transfer if a key cannot be found in from_dict (defaults to 'error')
    """
    return_dict = dict()
    for key in keys:
        return_dict[key] = from_dict.get(key, default)
    return return_dict
