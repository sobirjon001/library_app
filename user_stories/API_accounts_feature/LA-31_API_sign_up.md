[Home](../library_app_project.md) | [LA-26 API Accounts feature](./LA-26_API_accounts_feature.md)

# LA-31 API Sign up

## Description

There are sign up roles preset in configuration such as 'student' and 'new_hire_applicant'. New unauthorised user to system will be able to go through sign up process and according role will be granted with restircted priviliges will be granted to hip. With sign up role user will have access to his dashborad to go over some onboarding materials. Once management grant/approve him next role sign up account has to be discontinued. Sign up process can be achived bu calling API with `POST` method to endpoint `/api/users/sign_up` with payload:

```json
{
  "first_name": "string", max 20 chars long
  "last_name": "string", max 20 chars long
  "dob": "string", pattern of 'YYYY-MM-DD'
  "user_login": "string", max 20 chars long
  "password": "string", max 20 chars long
  "e_mail": "string", pattern of 'example@example.com'
  "phone_number": ["string", "number"] pattern of '000-000-0000'  or '0000000000'
  "role_name": "student" | "new_hire_applicant"
}
```

## Acceptance criteria:

### AC 1 Positive scenario to sign up

**Given** I sen API request with `POST` methos to endpoint `/api/users/sugn_up`

**When** All fields are accordingt ot **AC 1** of [LA-3 API Create new user](../API_users_feature/LA-3_API_create_new_user.md)

**And** `role_name` = "student" | "new_hire_applicant"

**Then** API server has to respond with success, status code `201`

**And** body returns new account information:

```json
{
  "account_id": "number",
  "user_id": "number",
  "role_id": "number",
  "account_status": "string",
  "termination_date": "string" | null,
  "first_name": "string",
  "last_name": "string",
  "dob": "string",
  "account_login": "string",
  "e_mail": "string"l,
  "phone_number": "string",
}
```

### AC 2 Negative scenario invalid user information

**Given** I sen API request with `POST` methos to endpoint `/api/users/sugn_up`

**When** All fields are NOT accordingt ot **AC 1** of [LA-3 API Create new user](../API_users_feature/LA-3_API_create_new_user.md)

**Then** API response will be according to **AC 2** and **AC 3** of [LA-3 API Create new user](../API_users_feature/LA-3_API_create_new_user.md)

### AC 3 Negative scenario invalid role_name

**Given** I sen API request with `POST` methos to endpoint `/api/users/sugn_up`

**When** All fields are accordingt ot **AC 1** of [LA-3 API Create new user](../API_users_feature/LA-3_API_create_new_user.md)

**And** `role_name` != "student" | "new_hire_applicant"

**Then** API wshould responf with failure and status code `401`
