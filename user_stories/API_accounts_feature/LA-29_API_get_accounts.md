[Home](../library_app_project.md) | [LA-26 API Accounts feature](./LA-26_API_accounts_feature.md)

# LA-29 API Get accounts

## Description

Management access has to be able to pull up accounts data by `account_id`, `user_login`
As an API application I have to be able to get accounts information by `user_login` using API endpoint with `GET` method and URL ending `/api/users/account`. API body has to have json object:

```json
{
  "user_login": "string"
}
```

By `account_id` using API endpoint using GET method and URL ending `/api/users/account/:id` . Instead of :id we need to provide account id. If account information found in database by given parameters then API server response with json payload example:

```json
{
  "account_id":  "number",
  "user_id": "user_id",
  "role_id": "role_id",
  "account_status": "account_status",
  "termination_date": "termination_date" | null,
}
```

## Acceptance criteria:

### AC 1 Get account by user_login

**Given** I send API request `GET` method with URL ending as `/api/users/account`

**When** all fields from API specification are present with correct values

**And** Acoount exist in system

**Then** API server has to respond with success, status code `200` and succsessfull message

**And** data have to have paylod returned:

```json
[
  {
    "account_id":  "number",
    "user_id": "user_id",
    "role_id": "role_id",
    "account_status": "account_status",
    "termination_date": "termination_date" | null,
  },
  {
    "account_id":  "number",
    "user_id": "user_id",
    "role_id": "role_id",
    "account_status": "account_status",
    "termination_date": "termination_date" | null,
  }
]
```

**Else** If no accounts exist by given `user_login`

**Then** API has to respond with status code `404`

---

### AC 2 Get account by account_id

**Given** I send API request `GET` method with URL ending as `/api/users/account/:id`

**When** Instead of :id we need to provide account id

**And** Acoount exist in system

**Then** API server has to respond with success, status code `200` and succsessfull message

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

**Else** If no accounts exist by given `account_id`

**Then** API has to respond with status code `404`
