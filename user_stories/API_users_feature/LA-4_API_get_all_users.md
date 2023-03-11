[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-4 API Get all users

## Description

As a application I have to be able to retrieve all users saved in system. API endpoint using `GET` method with URL ending of `/api/users` that may or may not have a json payload of pagination. Pagination is implemented so user can have users data in portions. Pagination example is a json object in API body:

```json
{
  "page": 1,
  "items_per_page": 5
}
```

where field `page` should request desired page and field `items_per_page` should request desired number of items per respond from system. Each API response has to give information about number of items/records saved in system and number of pages available based on requested number of items per page requested.

Pagination respond example:

```json
{
  "success": true,
  "message": "successfull request",
  "requested_number_of_items_per_page": 5,
  "requested_page_number": 2,
  "number_of_available_records": 10,
  "current_page": 2,
  "total_available_pages": 2,
  "number_of_records_fetched": 5
}
```

## Acceptance criteria:

### AC 1 Get user information

**Given** I send API request with `GET` method to URL endpoint `/api/users`

**When** there are users records saved in database

**Then** API server has to respond with success, status code `200` and payload has to return json object with data array having list of users saved in system. Each user body has to have fields: `user_id`, `first_name`, `last_name`, `dob`,`user_login`, `e_mail`, `phone_number`.

---

### AC 2 Pagination feature

**Given** I sen API request with `GET` method to URL endpoint `/api/users`

**When** I provide correct numbers for fields `page` and `items_per_page` within possible limits

**Then** API server has to respond with success, status code `200` and payload has to return json object according to **AC 1**

**And** json object has to have pagination information

**Else** API has to respond with failure, API code `413 `and give pagination information pointing to invalid number of records per page or page number

**And** give values for fields `number_of_available_records` and `total_available_pages`

---

### AC 4 Database changes

All accepted API requests has to be reflected in database records
