[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-17 API Get protected roles

## Description

As an application I want to be able to get list of role ids that are protected from deletion or modification. Such protected roles are system administrators and require certain clearance.

## Acceptance criteria:

### AC 1 Get protected roles

**Given** I send API request with method `GET` to URL ending `/api/users/protected_roles`

**When** records of protected roles found in database

**Then** API server should respond with success response, status code of `200` and array of protected role ids

**Else** API serve should respond with failure, status code of `404` and message that no record found

---

### AC 2 Protected roles are protected from modifications

**Given** I send API request to delete protected roles by `role id` according to **AC 1** of [LA-15 API Delete roles](./LA-15_API_delete_roles.md)

**AND/OR** to modify protected role according to **AC 1** of [LA-16 API Update role](./LA-16_API_update_role.md)

**Then** API server has to respond with failure, status code `403`, and message telling that requested role ids are used by system and protected from modifications and deletions.

---

### AC 3 Database consistency

All accepted API requests has to be reflected in database records
