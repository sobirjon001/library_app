[Home](../library_app_project.md) | [LA-26 API Accounts feature](./LA-26_API_accounts_feature.md)

# LA-30 Delete accounts

## Description

When management decides to delete redundant accounts then system has way to do so. Managment can delete account by calling `DELETE` method to API endpoint `/api/users/account` with payload of

```json
{
  "account_ids": ["numbers"]
}
```

_NOTE:_ When account deleted successfully user and role records has to remain

## Acceptance criteria:

### AC 1

**Given** I send API request with `DELETE` method to andpoint `/api/users/account`

**When** all fields from API specification are present with correct values

**And** At least one acoount exist in system

**Then** API server has to respond with success, status code `201` and succsessfull message

**Else** If no accounts found by diven `account_ids`

**Then** API has to respond with status code `404`

### AC 2

**Given** I successfully deleted account

**Then** User and role records has to remain in system
