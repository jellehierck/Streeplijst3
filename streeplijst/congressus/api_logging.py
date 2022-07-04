import logging
import json
from functools import wraps
from datetime import timedelta as TimeDelta
from typing import Callable, Optional

from rest_framework.response import Response

api_logger = logging.getLogger('streeplijst.api')


def _request_str(method: str, url_endpoint: str, params: dict = None, payload: dict = None) -> str:
    """
    Create a string representing a request.

    :param method: HTTP method
    :param url_endpoint: URL endpoint
    :param params: Optional dictionary containing URL query (everything after question mark)
    :param payload: Optional dictionary containing the request body
    :return: String representation of the request
    """
    query_str = ""
    if params:
        query_str = "?"
        query_str += "&".join(f"{key}={value}" for key, value in params.items())
        # for key, value in params.items():
        #     query_str += f"{key}={value}"

    body_str = ""
    if payload:
        body_str = f" body: \'{json.dumps(payload)}\'"

    return f"Request: \'{method.upper()} {url_endpoint + query_str}\'{body_str}"


def _response_str(status_code: int, elapsed_time: TimeDelta = None) -> str:
    """
    Create a string representing a response

    :param status_code: Status code
    :param elapsed_time: How much time passed during the request
    :return: String representation of the response
    """
    elapsed_str = ""
    if elapsed_time:
        elapsed_str = f" elapsed: {elapsed_time}"
    return f"Response: {status_code}{elapsed_str}"


def log_request(method: str, url_endpoint: str, params: dict = None, payload: dict = None) -> None:
    """
    Log a request to the api logger.

    :param method: HTTP method
    :param url_endpoint: URL endpoint
    :param params: Optional dictionary containing URL query (everything after question mark)
    :param payload: Optional dictionary containing the request body
    """
    api_logger.info(msg=_request_str(method=method, url_endpoint=url_endpoint, params=params, payload=payload))


def log_response(status_code: int, elapsed_time: TimeDelta = None) -> None:
    """
    Log a response to the api logger.

    :param status_code: Status code
    :param elapsed_time: How much time passed during the request
    """
    api_logger.info(msg=_response_str(status_code=status_code, elapsed_time=elapsed_time))


def log_request_response(func: Callable[..., Response]) -> Callable[..., Response]:
    """
    Decorator to log request and response from the API.

    :param func: Function to wrap. Should at
    :return:
    """

    @wraps(func)
    def wrapper(*args, method: str, url_endpoint: str, query_params: dict = None, payload: dict = None,
                **kwargs) -> Response:
        res = func(*args, method=method, url_endpoint=url_endpoint, query_params=query_params, payload=payload,
                   **kwargs)
        log_str = _response_str(status_code=res.status_code)
        log_str += " | " + _request_str(method=method, url_endpoint=url_endpoint, params=query_params, payload=payload)
        api_logger.info(log_str)
        return res

    return wrapper
