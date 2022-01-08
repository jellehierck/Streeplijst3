# API changes during upgrading to v30

Quick overview

- Trailing slash is removed from all URLs
    - e.g. `/members/` is now `/members`
- All endpoints now starth with the API version: `/<str:version>/*`
    - e.g. `/products` is now `/v20/products` or `/v30/products`
- `/members/<str:username>` is now `/members/username/<str:username>`
- `/products/<int:folder_id>` is now `/products/folder/<int:folder_id>`
- Multiple endpoints added

Overview of all URLs (rough overview, we could probably define this using OpenAPI or sth)

- `/streeplijst`  GET ping from the local server
- `/streeplijst/ping`  GET ping from the local server
- `/streeplijst/<str:version>` GET ping from the local server
- `/streeplijst/<str:version>/ping` GET ping from the local server
- `/streeplijst/<str:version>/members` GET all members (not supported in v30, likely times out in v20 unless
  query `username` is used)
- `/streeplijst/<str:version>/members/username/<str:username>` Get member by username
- `/streeplijst/<str:version>/members/id/<int:id>` GET member by Congressus ID
- `/streeplijst/<str:version>/products` GET all products (not supported in v30)
- `/streeplijst/<str:version>/products/folder/<int:folder_id>` Get products in a folder
- `/streeplijst/<str:version>/folders` GET all folders specified in the Streeplijst folder specification (stored
  in `streeplijst.congressus.utils` for now)
- `/streeplijst/<str:version>/sales/<str:username>` GET all sales for a specific user (not supported in v20, not
  implemented in v30 yet)
- `/streeplijst/<str:version>/sales` POST a new sale (not supported in v20)
    - POST data should be in the following format:

```json
{
  "member_id": <int>,
  "items": [
    {
      "product_offer_id": <int>,
      "quantity": <int>
    }
  ]
}
```