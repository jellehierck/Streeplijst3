import logging
import json

api_logger = logging.getLogger('streeplijst.api')


def api_log_request(method: str, url_endpoint: str, params: dict = None, payload: dict = None) -> None:
    """
    Log a request to the api logger.

    :param method: HTTP method
    :param url_endpoint: URL endpoint
    :param params: Optional dictionary containing URL query (everything after question mark)
    :param payload: Optional dictionary containing the request body
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

    log_str = f"Request: \'{method.upper()} {url_endpoint + query_str}\' {body_str}"
    api_logger.info(msg=log_str)
