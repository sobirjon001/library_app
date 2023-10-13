[Home](../library_app_project.md) | [LA-2 API Users feature](./LA-2_API_users_feature.md)

# LA-8 API Get protected users

## Description

As an application I want to be able to get list of user ids that are protected from deletion or modification. Such protected users are system administrators and require certain clearance.

## Acceptance criteria:

### AC 1 Get protected users

**Given** I send API request with method `GET` to URL ending `/api/users/protected`

**When** records of protected users found in database

**Then** API server should respond with success response, status code of `200` and array of protected users ids

**Else** API serve should respond with failure, status code of `404` and message that no record found

---

### AC 2 Protected users are protected from modifications

**Given** I send API request to delete protected user by user id according to **AC 1** of [LA-7 API Delete users](./LA-7_API_delete_users.md)

**AND/OR** to modify protected user according to **AC 1** [LA-6 API Update user](./LA-6_API_update_user.md)

**Then** API server has to respond with failure, status code `403`, and message telling that requested user ids are used by system and protected from modifications and deletions.

---

### AC 3 Database changes

All accepted API requests has to be reflected in database records
