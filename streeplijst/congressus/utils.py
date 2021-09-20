from typing import List


def strip_member_data(raw_member_data: dict) -> dict:
    """
    Strips data from a user API response to only include data that is relevant and not unnecessary personal details.

    :param raw_member_data: Raw API repsonse from Congressus.
    :return: A stripped dict only including some details of a user.
    """
    keys_to_transfer = [
        'date_of_birth',
        'first_name',
        'has_sdd_mandate',
        'id',
        'primary_last_name_main',
        'primary_last_name_prefix',
        'profile_picture',
        'show_almanac',
        'status',
        'status_id',
        'username'
    ]
    stripped_data = _extract_keys(raw_member_data, keys_to_transfer)
    return stripped_data


def strip_product_data(raw_product_data: dict) -> dict:
    """
    Strips data from a product API response to only include data that is relevant and clean up some weird nested
    objects.

    :param raw_product_data: Raw API response from Congressus.
    :return: A stripped dict only including some details of a user.
    """
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
    stripped_data['media'] = _extract_media_url(stripped_data)  # Replace list of media with a more sensible url
    stripped_data['offers'] = _cleanup_offers(stripped_data)  # Convert the price of each offer from string to int
    return stripped_data


def strip_sales_data(raw_sales_data: dict) -> dict:
    """
    Strips data from a sales API response to only include data that is relevant and clean up some weird nested objects.

    :param raw_sales_data: Raw API response from Congressus.
    :return: A stripped dict only including some details of a user.
    """
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
    stripped_data['items'] = _cleanup_sales_items(stripped_data)  # Replace list of media with a more sensible url
    return stripped_data


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


def _extract_media_url(product_data: dict) -> str:
    media_list: list = product_data.get('media', None)

    if media_list:
        return media_list[0]['url_md']  # Get the url of the first media object in the list
    else:
        return ''


def _cleanup_offers(product_data: dict) -> List:
    offers_list: list = product_data.get('offers', None)

    if offers_list:
        for offer in offers_list:
            offer['price'] = int(offer['price'])
    return offers_list


def _cleanup_sales_items(sales_data: dict) -> List:
    items_list: list = sales_data.get('items', None)

    if items_list:
        for item in items_list:
            item['price'] = int(item['price'])
            item['total_price'] = int(item['total_price'])
    return items_list
