[Home](../library_app_project.md) | [LA-1 DB Database infrastructure](./LA-1_DB_databse_feature.md)

# LA-20 DB Account tables

## Description

In order for account feature to work we need to have `users`, `roles` and `accounts` tables created. `users` table will have demographics, contact and login information. Only one record in `users` table will correspond to one person. `roles` table will hold role types. Roles will have boolean values for qlearance to perform some actions. `account` table will hold combination of user and role data so one person can have multiple roles where depending on what role he logged in he will have some qlearance. Accounts will have status and expiration dates so there will be some controll over users in regards to qlearance.

## Acceptance criteria:

### AC 1 Users table

`users` table has to be created with constrains:

| column       | type         | constrains                 |
| ------------ | ------------ | -------------------------- |
| user_id      | INT          | AUTO_INCREMENT PRIMARY KEY |
| first_name   | VARCHAR(20)  | NOTNULL                    |
| last_name    | VARCHAR(20)  | NOT NULL                   |
| dob          | DATE         | NOT NULL                   |
| user_login   | VARCHAR(20)  | NOT NULL UNIQUE            |
| password     | VARCHAR(100) | NOT NULL                   |
| e_mail       | VARCHAR(100) | NOT NULL UNIQUE            |
| phone_number | VARCHAR(10)  | UNIQUE                     |

---

### AC 2 Protected users table

`protected_users` table has to be created with constrains:

| column  | type | constrains      |
| ------- | ---- | --------------- |
| user_id | INT  | NOT NULL UNIQUE |

---

### AC 3 Roles table

`roles` table has to be created with constrains:

| column           | type        | constrains                 |
| ---------------- | ----------- | -------------------------- |
| role_id          | INT         | AUTO_INCREMENT PRIMARY KEY |
| role_name        | VARCHAR(20) | NOT NULL UNIQUE            |
| can_read_role    | BOOLEAN     | DEFAULT FALSE              |
| can_create_role  | BOOLEAN     | DEFAULT FALSE              |
| can_modify_role  | BOOLEAN     | DEFAULT FALSE              |
| can_delete_role  | BOOLEAN     | DEFAULT FALSE              |
| can_read_order   | BOOLEAN     | DEFAULT FALSE              |
| can_create_order | BOOLEAN     | DEFAULT FALSE              |
| can_modify_order | BOOLEAN     | DEFAULT FALSE              |
| can_delete_order | BOOLEAN     | DEFAULT FALSE              |
| can_read_user    | BOOLEAN     | DEFAULT FALSE              |
| can_create_user  | BOOLEAN     | DEFAULT FALSE              |
| can_modify_user  | BOOLEAN     | DEFAULT FALSE              |
| can_delete_user  | BOOLEAN     | DEFAULT FALSE              |
| can_read_book    | BOOLEAN     | DEFAULT FALSE              |
| can_create_book  | BOOLEAN     | DEFAULT FALSE              |
| can_modify_book  | BOOLEAN     | DEFAULT FALSE              |
| can_delete_book  | BOOLEAN     | DEFAULT FALSE              |
| can_read_events  | BOOLEAN     | DEFAULT FALSE              |

---

### AC 4 Protected roles table

`protected_roles` table has to be created with constrains:

| column  | type | constrains      |
| ------- | ---- | --------------- |
| role_id | INT  | NOT NULL UNIQUE |

---

### AC 5 Sign-up roles table

`sign_up_roles` table has to be created with constrains:

| column    | type        | constrains      |
| --------- | ----------- | --------------- |
| role_name | VARCHAR(20) | NOT NULL UNIQUE |

---

### AC 6 Accounts table

`accounts` table has to be created with constrains:

| column           | type        | constrains                 |
| ---------------- | ----------- | -------------------------- |
| account_id       | INT         | AUTO_INCREMENT PRIMARY KEY |
| user_id          | INT         | NOT NULL                   |
| role_id          | INT         | NOT NULL                   |
| account_status   | VARCHAR(20) | NOT NULL                   |
| termination_date | date        | NULL DEFAULT NULL          |

| Primary and foreign key references              |
| ----------------------------------------------- |
| FOREIGN KEY (user_id) REFERENCES users(user_id) |
| FOREIGN KEY (role_id) REFERENCES roles(role_id) |
