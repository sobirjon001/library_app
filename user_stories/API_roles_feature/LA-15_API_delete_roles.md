[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-15 API Delete roles

## Description

As an application I want to be able to delete role. API request using method `DELETE` with URL ending `/api/users/roles` and json payload of array of user ids in body example:

```json
{
  "role_ids": [1, 2, 3]
}
```

## Acceptance criteria:

### AC 1 Positive scenario deleting roles

**Given** I send API request using method `DELETE` with URL ending `/api/users/roles`

**When** role ids to delete found

**Then** API server should respond as success with status code `200`

**AND** All accepted API requests has to be reflected in database records

_NOTE:_ If some of role ids aren't exist in database then API server should delete existing ids and notify not existing ids in `non_existing_roles_ids` field array

---

### AC 2 Negative scenario deleting roles

**Given** I send API request using method `DELETE` with URL ending `/api/users/roles`

**When** role ids to delete NOT found

**Then** API server should reject with status code `404` and message telling that no records found
