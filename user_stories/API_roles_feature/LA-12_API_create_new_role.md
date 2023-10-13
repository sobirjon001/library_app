[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-12 API Create new role

## Description

As an API application I have to be able to create roles. API endpoint has to process API request, validate payload to match accepted criteria for fields specifications and validate business requirements for values ans if all requirements met save data to database, else respond with negative message back to API request. API endpoint using `POST` method with URL ending as `/api/users/role` with json payload schema:

```json
{
  "role_name": "string", max 20 chars long UNIQUE
  "can_read_role": "boolean",
  "can_create_role": "boolean",
  "can_modify_role": "boolean",
  "can_delete_role": "boolean",
  "can_read_order": "boolean",
  "can_create_order": "boolean",
  "can_modify_order": "boolean",
  "can_delete_order": "boolean",
  "can_read_user": "boolean",
  "can_create_user": "boolean",
  "can_modify_user": "boolean",
  "can_delete_user": "boolean",
  "can_read_book": "boolean",
  "can_create_book": "boolean",
  "can_modify_book": "boolean",
  "can_delete_book": "boolean",
  "can_read_events": "boolean",
}
```

All fields are required. If API request accepted it has to respond with json as payload:

```json
{
    "success": true,
    "message": "Successfully created new role",
    "data": {
        "role_id": data have to return role_id
        . . .
    }
}
```

## Acceptance criteria:

### AC 1 Positive scenario creating new role

**Given** I send API request `POST` method with URL ending as `/api/users/role`

**When** all fields from API specification are present with correct values

**Then** API server has to respond with success, status code `201` and message telling than new role created

**And** data have to have `role_id`

**Else** API has to reject pointing to invalid or missing fields with status code of `403`.

---

### AC 2 Negative scenario with invalid value lengths

**Given** I send API request `POST` method with URL ending as `/api/users/role `

**When** field `role_name` have value lengths more than 20 characters

**AND/OR** boolean fields `can_read_role`, `can_create_role`, `can_modify_role`, `can_delete_role`, `can_read_order`, `can_create_orde`, `can_modify_orde`, `can_delete_orde`, `can_read_user`, `can_create_user`, `can_modify_user`, `can_delete_user`, `can_read_book`, `can_create_book`, `can_modify_book`, `can_delete_book`, `can_read_events` is not equal to `true` or `false`

**Then** API server has to reject with status code `403` and message pointing to fields having invalid values

---

### AC 3 Negative scenario with duplicate values in unique fields

**Given** I send API request POST method with URL ending as `/api/users/role`

**When** value for field `role_name` is duplicated/already exist in database

**Then** API server has to reject with status code `403` and message about duplicated value

---

### AC 4 Database changes

All accepted API requests has to be reflected in database records
