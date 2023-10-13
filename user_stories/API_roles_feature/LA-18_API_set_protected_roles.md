[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-18 API Set protected roles

## Description

As an application I have to be able to set desired role ids to protected list so that they will be protected from deletions or modifications.

## Acceptance criteria:

### AC 1 Set protection to roles

**Given** I send API request with method `POST` to URL ending `/api/users/protected_roles`

**When** regardless of whether this role ids are already saved

**Then** API server should respond with success, status code of `201` and list of sent role ids

---

### AC 2 Protected roles are protected from modifications

**Given** I send API request to delete protected roles by role id according to **AC 1** of[LA-15 API Delete roles](./LA-15_API_delete_roles.md)

**AND/OR** to modify protected role according to **AC 1** of [LA-16 API Update role](./LA-16_API_update_role.md)

**Then** API server has to respond with failure, status code `403`, and message telling that requested role ids are used by system and protected from modifications and deletions.

---

### AC 3 Database consistency

All accepted API requests has to be reflected in database records
