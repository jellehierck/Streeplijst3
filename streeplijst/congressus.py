import os

CONGRESSUS_API_URL_BASE = "https://api.congressus.nl/v20"

CONGRESSUS_HEADERS = {
    'Authorization': 'Bearer:' + os.environ.get('CONGRESSUS_API_TOKEN')
}

MAX_RETRIES = 3

TIMEOUT = 10


def transfer_key(from_dict: dict, to_dict: dict, key: str, default: str = 'error') -> None:
    """
    Utility function. Transfers a key and its associated value from one dict to another.

    :param from_dict: Source dict
    :param to_dict: Destination dict
    :param key: Key to transfer
    :param default: Default value to transfer (defaults to 'error')
    """
    to_dict[key] = from_dict.get(key, default)


def strip_member_data(raw_member_data: dict) -> dict:
    """
    Strips data from a user API response to only include data that is relevant and not unnecessary personal details.

    :param raw_member_data: Raw API repsonse from Congressus.
    :return: A stripped dict only including some details of a user.
    """
    stripped_data = dict()
    transfer_key(raw_member_data, stripped_data, 'date_of_birth')
    transfer_key(raw_member_data, stripped_data, 'first_name')
    transfer_key(raw_member_data, stripped_data, 'has_sdd_mandate')
    transfer_key(raw_member_data, stripped_data, 'id')
    transfer_key(raw_member_data, stripped_data, 'primary_last_name_main')
    transfer_key(raw_member_data, stripped_data, 'primary_last_name_prefix')
    transfer_key(raw_member_data, stripped_data, 'profile_picture')
    transfer_key(raw_member_data, stripped_data, 'show_almanac')
    transfer_key(raw_member_data, stripped_data, 'status')
    transfer_key(raw_member_data, stripped_data, 'status_id')
    transfer_key(raw_member_data, stripped_data, 'username')

    return stripped_data
