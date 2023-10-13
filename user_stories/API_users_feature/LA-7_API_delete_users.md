[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-7 API Delete users

## Description

As an application I want to be able to delete user. API request using method `DELETE` with URL ending `/api/users` and json payload of array of user ids in body:

```json
{
  "user_ids": [1, 2, 3]
}
```

## Acceptance criteria:

### AC 1 Positive scenario deleting users

**Given** I send API request using method `DELETE` with URL ending `/api/users`

**When user** ids to delete found

**Then** API server should respond as success with status code `201`

**AND** All accepted API requests has to be reflected in database records

_NOTE:_ If some of user ids aren’t exist in database then API server should delete existing ids and notify not existing ids in `non_existing_user_ids` field array

---

### AC 2 Negative scenario deleting users

**Given** I send API request using method `DELETE` with URL ending `/api/users`

**When** user ids to delete NOT found

**Then** API server should reject with status code `404` and message telling that no records found
