[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-10 API Remove users from protected list

## Description

As an application I have to be able to remove desired user ids from protected users.

_Note:_ Features checking role clearance to perform such action are coming in future.

## Acceptance criteria:

### AC 1 Remove users protection

**Given** I send API request with method `PATCH` to URL ending `/api/users/protected`

**And** body should have array of user ids to remove from protected list

```json
{
  "user_ids": [1, 2, 3]
}
```

**When** requested user ids found

**Then** API server should respond with success, status code `201` and listing requested user ids to be removed from protection.

**Else** API server should respond with success, status code `404` and message that no data was found by `role_ids`

---

### AC 2 Protected users are protected from modifications

**Given** I delete no longer protected use according to **AC 1** of [LA-7 API Delete users](./LA-7_API_delete_users.md)

**AND/OR** modify no longer protected user according to **AC 1** of [LA-6 API Update user](./LA-6_API_update_user.md)

**Then** API server has to respond without failures since user is no longer protected.

_Note:_ All rules of negative scenarios of modification and deletion stories remain according to their ACs.

---

### AC 3 Database changes

All accepted API requests has to be reflected in database records
