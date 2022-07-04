import logging
import json
from datetime import timedelta as TimeDelta

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
        body_str = f"body: \'{json.dumps(payload)}\'"

    return f"Request: \'{method.upper()} {url_endpoint + query_str}\' {body_str}"


def _response_str(status_code: int, elapsed_time: TimeDelta = None) -> str:
    """
    Create a string representing a response

    :param status_code: Status code
    :return: String representation of the response
    """
    elapsed_str = ""
    if elapsed_time:
        elapsed_str = f"elapsed: {elapsed_time}"
    return f"Response: {status_code} {elapsed_str}"


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
    """
    api_logger.info(msg=_response_str(status_code=status_code, elapsed_time=elapsed_time))
