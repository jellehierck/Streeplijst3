import logging
import json
from functools import wraps
from datetime import timedelta as TimeDelta, datetime as DateTime
from typing import Callable, Union
import uuid
import threading

from rest_framework.response import Response
from rest_framework.request import Request

from streeplijst.congressus.api_base import ApiBase

api_local_logger = logging.getLogger('api.local')  # Local API call logs

api_congressus_logger = logging.getLogger('api.congressus')  # Congressus API call logs

threading_local = threading.local()  # Object which allows sharing information between logs which belong to the same request


class InjectRequestIdFilter(logging.Filter):

    def filter(self, record: logging.LogRecord) -> bool:
        # record.id = uuid.uuid4()  # Add a uuid to the record so that we can differentiate it from other requests
        record.request_id = getattr(threading_local, "request_id", "NO_ID")
        return True


def _congressus_request_str(method: str, url_endpoint: str, params: dict = None, payload: dict = None) -> str:
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
        query_str = query_str.replace("'", '"')  # Replace single quotes by double quotes

    body_str = ""
    if payload:
        body_json = json.dumps(payload).replace("'", '"')  # Replace single quotes by double quotes
        body_str = f" body: \'{body_json}\'"

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
        elapsed_str = f" (elapsed: {elapsed_time})"
    return f"Response: {status_code}{elapsed_str}"


def log_congressus_request_response(res_status: int, method: str, url: str, params: dict = None,
                                    payload: dict = None, elapsed_time: TimeDelta = None) -> None:
    """
    Log request and response to Congressus.

    :param res_status: Status code of request
    :param elapsed_time: Optional time before response
    :param method: HTTP method
    :param url: Full URL
    :param params: Optional dictionary containing URL query (everything after question mark)
    :param payload: Optional dictionary containing the request body
    """
    log_str = f"{_response_str(status_code=res_status, elapsed_time=elapsed_time)} | " \
              f"{_congressus_request_str(method=method, url_endpoint=url, payload=payload, params=params)}"

    # Log message based on status code
    if res_status >= 500:  # Status is server error
        api_congressus_logger.error(msg=log_str)
    elif res_status >= 400:  # Status is client error
        api_congressus_logger.warning(msg=log_str)
    else:  # Status is OK
        api_congressus_logger.info(msg=log_str)


def log_local_request_response(func: Callable[..., Response]) \
        -> Callable[..., Response]:
    """
    Decorator to log request and response from the API.

    :param func: Function to wrap.
    """

    @wraps(func)
    def wrapper(self: ApiBase, req: Request, *args, **kwargs) -> Response:
        threading_local.request_id = str(uuid.uuid4())[:8]  # Set an 8 char request ID to access it from other loggers

        start_time = DateTime.now()
        res = func(self, req, *args, **kwargs)
        log_str = _response_str(status_code=res.status_code, elapsed_time=DateTime.now() - start_time)
        log_str += " | "
        log_str += f"Request: \'{req.method} {req.get_full_path()}\'"

        # Iterate over all args, convert them to str, and join them
        args_str = ','.join(map(str, args))
        args_str = args_str.replace("'", '"')  # Replace any single quotes by double quotes

        # Iterator over all kwargs, convert them into k=v and join them
        kwargs_str = ','.join(f'{k}={v}' for k, v in kwargs.items())
        kwargs_str = kwargs_str.replace("'", '"')  # Replace any single quotes by double quotes

        # If both args and kwarts exist, add a comma between them
        if args_str and kwargs_str:
            args_str += ','

        # Form the final representation by adding func name and print everything
        log_str += f" function: {func.__name__}({args_str}{kwargs_str})"

        # Log message based on status code
        if res.status_code >= 500:  # Status is server error
            api_local_logger.error(msg=log_str)
        elif res.status_code >= 400:  # Status is client error
            api_local_logger.warning(msg=log_str)
        else:  # Status is OK
            api_local_logger.info(msg=log_str)

        return res

    return wrapper
