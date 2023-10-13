[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-14 API Get role name by role_id or role_name

## Description

As an API application I have to be able to get role information by `role_name` using API endpoint with `GET` method and URL ending `/api/users/role_by_role_name`. API body has to have json object:

```json
{
  "role_name": "string"
}
```

By `role_id` using API endpoint using GET method and URL ending `/api/users/role/:id` . Instead of :id we need to provide role id. If role information found in database by given parameters then API server response with json payload example:

```json
{
  "success": true,
  "message": "successfully found role",
  "data": {
    "role_id": 4,
    "role_name": "student",
    "can_read_role": 0,
    "can_create_role": 0,
    "can_modify_role": 0,
    "can_delete_role": 0,
    "can_read_order": 0,
    "can_create_order": 0,
    "can_modify_order": 0,
    "can_delete_order": 0,
    "can_read_user": 0,
    "can_create_user": 0,
    "can_modify_user": 0,
    "can_delete_user": 0,
    "can_read_book": 0,
    "can_create_book": 0,
    "can_modify_book": 0,
    "can_delete_book": 0,
    "can_read_events": 0
  }
}
```

0 represents `false` and 1 represents `true` . This role information will be used to determine clearance for actions in particular micro services.

## Acceptance criteria:

### AC 1 Positive scenario getting role by role_name

**Given** I send API request using `GET` method with URL ending `/api/users/role_by_role_name`

**When** role by given role name found in database

**Then** API server has to respond with success, status code `200` and json payload

---

### AC 2 Negative scenario invalid value

**Given** I send API request using `GET` method with URL ending `/api/users/role_by_role_name`

**When** field `role_name` value > 20 characters in length

**AND/OR** field `role_name` value is not string

**Then** API server has to respond with failure, status code `403` and message informing invalid value in field role_name

---

### AC 3 Positive scenario getting role by role_id

**Given** I send API request using `GET` method with URL ending `/api/users/role/:id`

**AND** instead of `:id` I provide role id

**When** role by given role id found in database

**Then** API server has to respond with success, status code `200` and json payload

---

### AC 4 Negative scenario role not found

**Given** I send API Request according to **AC 1** and **AC 3**

**When** role by given parameters is not found in database

**Then** API server has to respond with failure, status code `404` and message informing that no record found

---

### AC 5 Database consistency

All accepted API requests has to be reflected in database records
