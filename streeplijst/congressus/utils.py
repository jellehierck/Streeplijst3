from dataclasses import dataclass
from typing import List


@dataclass
class FolderConfiguration:
    name: str  # folder name
    id: int  # folder id (determined by Congressus, found in URL of the folder in the manager)
    media: str  # url to image file


STREEPLIJST_FOLDER_CONFIGURATION = [
    FolderConfiguration(**{
        'name': "Chips",
        'id': 1991,
        'media': "https://www.paradoks.utwente.nl/_media/889901/afa76d9d15c44705a9b7ef4da818ef2c/view"
    }),
    FolderConfiguration(**{
        'name': "Soep",
        'id': 1992,
        'media': "https://www.paradoks.utwente.nl/_media/889902/d1de3e30149f48238d7df0566454a55f/view"
    }),
    FolderConfiguration(**{
        'name': "Healthy",
        'id': 1993,
        'media': "https://www.paradoks.utwente.nl/_media/889906/447f0d874bcb48479b43dede97149183/view"
    }),
    FolderConfiguration(**{
        'name': "Diepvries",
        'id': 1994,
        'media': "https://www.paradoks.utwente.nl/_media/889938/a1be36b57e9d4cd4aba77a0a169ad8ed/view"
    }),
    FolderConfiguration(**{
        'name': "Snoep",
        'id': 1995,
        'media': "https://www.paradoks.utwente.nl/_media/889918/eda7aefce97745488c867c1fd46e580b/view"
    }),
    FolderConfiguration(**{
        'name': "Koek",
        'id': 1996,
        'media': "https://www.paradoks.utwente.nl/_media/889908/5bbaa93d68fb4886974309dd09e3920f/view"
    }),
    FolderConfiguration(**{
        'name': "Repen",
        'id': 1997,
        'media': "https://www.paradoks.utwente.nl/_media/889915/596ad94dc4fc42b6910d9648fed06aad/view"
    }),
    FolderConfiguration(**{
        'name': "Speciaal",
        'id': 1998,
        'media': "https://www.paradoks.utwente.nl/_media/889910/63b78b80f2224dff8c46bfb8456d0bc8/view"
    }),
    FolderConfiguration(**{
        'name': "Frisdrank",
        'id': 2600,
        'media': "https://www.paradoks.utwente.nl/_media/1074042/9737731eab49463eb625490e9d2d1b20/view"
    }),
]


def strip_member_data(raw_member_data: dict) -> dict:
    """
    Strips data from a user API response to only include data that is relevant and not unnecessary personal details.

    :param raw_member_data: Raw API repsonse from Congressus.
    :return: A stripped dict only including some details of a user.
    """
    keys_to_transfer = [
        'id',
        'username',
        'status',
        'gender',
        'prefix',
        'initials',
        'nickname',
        'given_name',
        'first_name',
        'primary_last_name_main',
        'primary_last_name_prefix',
        'primary_last_name',
        'secondary_last_name_main',
        'secondary_last_name_prefix',
        'secondary_last_name',
        'last_name_display',
        'last_name',
        'search_name',
        'suffix',
        'date_of_birth',
        'show_almanac',

        'has_sdd_mandate',  # TODO: See how this works with sdd mandate
        'bank_account'  # TODO: Remove this and only extract sdd mandate
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
