[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-9 API Set protected users

## Description

As an application I have to be able to set desired user ids to protected list so that they will be protected from deletions or modifications.

## Acceptance criteria:

### AC 1 Set protection to users

**Given** I send API request with method `POST` to URL ending `/api/users/protected`

**And** body should have array of user ids to add to protected list

```json
{
  "user_ids": [1, 2, 3]
}
```

**When** regardless of whether this user ids are already saved

**Then** API server should respond with success, status code of `201` and list of sent user ids

---

### AC 2 Protected users are protected from modifications

**Given** I send API request to delete protected user by user id according to **AC 1** [LA-7 API Delete users](./LA-7_API_delete_users.md)

**AND/OR** to modify protected user according to **AC 1** [LA-6 API Update user](./LA-6_API_update_user.md)

**Then** API server has to respond with failure, status code `403`, and message telling that requested use ids are used by system and protected from modifications and deletions.

---

### AC 3 Database changes

All accepted API requests has to be reflected in database records
