[Home](../library_app_project.md) | [LA-11 API Roles feature](./LA-11_API_roles_feature.md)

# LA-19 API Remove roles from protection list

## Description

As an application I have to be able to remove desired role ids from protected roles.

_Note:_ Features checking role clearance to perform such action are coming in future.

## Acceptance criteria:

### AC 1 Remove roles protection

**Given** I send API request with method `PATCH` to URL ending `/api/users/protected_roles`

**When** regardless of whether requested role ids found

**Then** API server should respond with success, status code `200` and listing requested role ids to be removed from protection.

---

### AC 2 Protected roles are protected from modifications

**Given** I send API request to delete protected roles by role id according to **AC 1** of [LA-15 API Delete roles](./LA-15_API_delete_roles.md)

**AND/OR** to modify protected role according to **AC 1** of [LA-16 API Update role](./LA-16_API_update_role.md)

**Then** API server has to respond without failures since user is no longer protected.

_Note:_ All rules of negative scenarios of modification and deletion stories remain according to their ACs.

---

### AC 3 Database consistency

All accepted API requests has to be reflected in database records
