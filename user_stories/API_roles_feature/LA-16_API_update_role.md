[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-16 API Update role

## Description

As an application I have to be able to update user information. API request has to be done using `PATCH` method with end URL `/api/users/role`. Request body has to have a json body:

```json
{
  "role_id": "number",
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

Field `role_id` is required and is used to find target record for updating. All other fields are optional but at least one optional field has to be present.

## Acceptance criteria:

### AC 1 Positive scenario update role information

**Given** I send API request using `PATCH` method with end URL `/api/users/role`

**When** field `role_id` is present with existing in database role id

**AND** all rules according to **AC 1**, **AC 2** and **AC 3** of [LA-12 API Create new role](./LA-12_API_create_new_role.md) respected

**AND** at least one optional field present

**Then** API server has to respond with code `201` returning user record information

**ELSE** API has to reject pointing to invalid or missing fields with status code of `403`.

---

## AC 2 Negative scenario invalid values

Please follow rules for **AC 1**, **AC 2** and **AC 3** of [LA-12 API Create new role](./LA-12_API_create_new_role.md)

---

## AC 3

**Given** I send API request using `PATCH` method with end URL `/api/users/role`

**When** no records in database found by given `role_id`

**Then** API has to respond with code `404` and message that record is not found.

---

### AC 4 Database consistency

All accepted API requests has to be reflected in database records.
