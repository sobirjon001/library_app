[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-3 API Create new user

## Description

As a API application I have to be able to create user data in system. API endpoint has to process API request, validate payload to match accepted criteria for fields specifications and validate business requirements for values ans if all requirements met save data to database, else respond with negative message back to API request. API endpoint using POST method with URL ending as /users with json payload schema:

```json
{
  "first_name": "string", max 20 chars long
  "last_name": "string", max 20 chars long
  "dob": "string", pattern of 'YYYY-MM-DD'
  "user_login": "string", max 20 chars long
  "password": "string", max 20 chars long
  "e_mail": "string", pattern of 'example@example.com'
  "phone_number": ["string", "number"] pattern of '000-000-0000'  or '0000000000'
}
```

All fields are required. If API request accepted it has to respond with json as payload:

```json
{
  "success": true,
  "message": "Sucssessfully created new user",
  "data": data have to return user_id
}
```

## Acceptance criteria:

### AC 1 Positive scenario creating new user

**Given** I send API request POST method with URL ending as `/api/users`

**When** all fields from API specification are present with correct values

**Then** API server has to respond with success, status code `201` and message telling that new user created

**And** data have to have `user_id`

**Else** API has to reject pointing to invalid or missing fields with status code of `403`.

---

### AC 2 Negative scenario with invalid value lengths

**Given** I send API request POST method with URL ending as `/api/users`

**When** one ore more of next fields `first_name`, `last_name`, `user_login`, `password` have value lengths more than 20 characters

**AND/OR** field `dob` don’t have pattern of `YYYY-MM-DD`

**AND/OR** field `e_mail` don’t have pattern of `example@example.com`

**AND/OR** field `phone_number` don’t have pattern of `000-000-0000` or `0000000000` 10 digits in length

**Then** API server has to reject with status code `403` and message pointing to fields having invalid values

---

### AC 3 Negative scenario with duplicate values in unique fields

**Given** I send API request `POST` method with URL ending as `/api/users`

**When** values for fields `user_login` , `phone_number` and `e_mail` are duplicated/already exist in database

**Then** API server has to reject with status code `409` and message pointing to fields having duplicated values

---

### AC 4 Database changes

All accepted API requests has to be reflected in database records
