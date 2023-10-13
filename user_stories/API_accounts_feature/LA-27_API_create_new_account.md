[Home](../library_app_project.md) | [LA-26 API Accounts feature](./LA-26_API_accounts_feature.md)

# LA-27 API Create new account

## Description

Account can be created by managemant qlearance and it record is created in `accounts` table where we have relations to `users` and `roles` tables. Account approach will give users flexibility to log in to different layes of qlearance if they have more that one roles. Accaount data will be used for log in and access control. Aslo all events will utilyse `account_id` for historical records. Account can be created by calling `POST` method to API endpoint `/api/users/account` and providing payload:

```json
{
  "user_id": "number",
  "role_id": "number",
  "account_status": "string", // max 20 characters
  "termination_date": "string" | null,// <- optional field
}
```

Required fields are `user_id`, `role_id`, `account_status`. Last field max length is 20 charakters. `termination_date` is optional field, default value will be `null`. If `termination_date` format has to be in 'YYYY-MM-DD' format. Termination date can't be before today's date.

## Acceptance criteria:

### AC 1 Positive scenario

**Given** I send API request `POST` method with URL ending as `/api/users/account`

**When** all fields from API specification are present with correct values

**And** Acoount does not exist in system

**Then** API server has to respond with success, status code `201` and message telling than new account created

**And** data have to have paylod returned:

```json
{
  "account_id":  "number",
  "user_id": "user_id",
  "role_id": "role_id",
  "account_status": "account_status",
  "termination_date": "termination_date" | null,
}
```

---

### AC 2 Negative scenario with duplicated entry

**Given** I send API request `POST` method with URL ending as `/api/users/account`

**When** all fields from API specification are present with correct values

**And** Acoount alredy exist in system

**Then** API has to reject stating that account already exist with status code of `403`

---

### AC 3 Negative scenario with invalid value lengths

**Given** I send API request `POST` method with URL ending as `/api/users/account`

**When** field `account_status` have value lengths more than 20 characters

**AND/OR** missing fields `user_id` and `role_id`

**Then** API server has to reject with status code `403` and message pointing to missing required fields or having invalid values

---

### AC 4 Negative scenario with invalid values for termination_date

**Given** I send API request `POST` method with URL ending as `/api/users/account`

**When** value for field `termination_date` is not in 'YYYY-MM-DD' format

**OR** date for field `termination_date` is before todays date

**Then** API server has to reject with status code `403` and message about invalid values for `termination_date`

---

### AC 5 Database changes

All accepted API requests has to be reflected in database records
