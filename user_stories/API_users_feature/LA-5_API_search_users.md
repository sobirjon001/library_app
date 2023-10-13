[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-5 Search users

## Description

As an API application I have to be able to search for users using search query parameters. API endpoint using `GET` method with URL ending `/api/users/search` with acceptable Query Parameters keys: `user_id`, `user_login`, `e_mail`, `phone_number`, `first_name`, l`ast_name`. At least one key field has to be present. If more than one key field present then at least one has to have value, others can be empty or `*`. If proper search query sent API serve has to respond with status code `200` and body has to have pagination response with user bodies presented in data array. Each user body has to have fields: `user_id`, `first_name`, `last_name`, `dob`,`user_login`, `e_mail`, `phone_number`.

## Acceptance criteria:

### AC 1 Positive scenario of searching users by query parameters

**Given** I send API request using `GET` method with URL ending `/api/users/search `

**When** at least one of query parameters f`ields user_id`, `user_login`, `e_mail`, `phone_number`, `first_name`, `last_name` present with value

**AND/OR** more than one query parameters fields present but at least one has value and others can be empty or equal to `*`

**AND** records found in database according to requested query parameters

**Then** API server has to respond with success, status code `200` and payload with pagination according to [LA-4 API Get all users / AC-1](./LA-4_API_get_all_users.md)

---

### AC 2 Negative scenario missing value

**Given** I send API request using `GET` method with URL ending `/api/users/search`

**When** none of query parameters fields `user_id`, `user_login`, `e_mail`, `phone_number`, `first_name`, `last_name` present

**AND/OR** all of query parameters fields are empty or equal to `*`

**Then** API server has to reject with code `403` and instructions of available query parameters we can use.

---

### AC 3 Negative scenario not acceptable query parameters

**Given** I send API request using `GET` method with URL ending `/api/users/search`

**When** query parameters have fields other than `user_id`, `user_login`, `e_mail`, `phone_number`, `first_name`, `last_name`

**Then** API server has to reject with code `403` listing not acceptable query parameters used in request

---

### AC 4 Negative scenario with no records found

**Given** I send API request using `GET` method with URL ending `/api/users/search`

**When** no records found in database according to requested query parameters

**Then** API server has to respond with failure, status code `404` and message informing no record found
