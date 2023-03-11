[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-6 API Update user

## Description

As an application I have to be able to update user information. API request has to be done using `PATCH` method with end URL `/api/users`. Request body has to have a json body:

```json
{
  "user_id": "number",
  "first_name": "string",
  "last_name": "string",
  "dob": "string",
  "user_login": "string",
  "e_mail": "string",
  "phone_number": ["string", "number"]
}
```

Field `user_id` is required and is used to find target record for updating. All other fields are optional but at least one optional field has to be present.

## Acceptance criteria:

### AC 1 Positive scenario update user information

**Given** I send API request using `PATCH` method with end URL `/api/users`

**When** field `user_id` is present with existing in database user id

**AND** all rules according to **AC 2** and **AC 3** of [LA-3 API Create new user](./LA-3_API_create_new_user.md) respected

**AND** at least one optional field present

**Then** API server has to respond with code `201` returning user record information

**ELSE** API has to reject pointing to invalid or missing fields with status code of `403`.

---

### AC 2 Negative scenario invalid values

Please follow rules for **AC 2** and **AC 3** of [LA-3 API Create new user](./LA-3_API_create_new_user.md)

---

### AC 3

**Given** I send API request using `PATCH` method with end URL `/api/users`

**When** no records in database found by given `user_id`

**Then** API has to respond with code `404` and message that record is not found.

---

### AC 4 Negative scenario change restricted field

**Given** I send API request using `PATCH` method with end URL `/api/users`

**When** field password is present

**Then** API server has to reject with code `403` with message describing that changing password is forbidden and user should change password himself with forgot my password procedure.

---

### AC 5 Database changes

All accepted API requests has to be reflected in database records.
