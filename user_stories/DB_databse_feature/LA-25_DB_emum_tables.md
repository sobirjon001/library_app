[Home](../library_app_project.md) | [LA-1 DB Database infrastructure](./LA-1_DB_databse_feature.md)

# LA-25 DB Enum tables

## Description

Evnum nable are needed tocreat project dynamis values. This values are created by project managesr to manage key features and settings in various options for project

## Acceptance criteria:

### AC 1 Account status enum table

`account_status_enum` table has to be created with constrains:

| column         | type        | constrains      |
| -------------- | ----------- | --------------- |
| account_status | VARCHAR(50) | NOT NULL UNIQUE |

---

### AC 2 Book condition enum table

`book_condition_enum` table has to be created with constrains:

| column         | type        | constrains      |
| -------------- | ----------- | --------------- |
| book_condition | VARCHAR(50) | NOT NULL UNIQUE |

---

### AC 3 Book availability enum table

`book_availability_enum` table has to be created with constrains:

| column            | type        | constrains      |
| ----------------- | ----------- | --------------- |
| book_availability | VARCHAR(50) | NOT NULL UNIQUE |

---

### AC 4 Age restriction enum table

`age_restriction_enum` table has to be created with constrains:

| column          | type        | constrains      |
| --------------- | ----------- | --------------- |
| age_restriction | VARCHAR(50) | NOT NULL UNIQUE |

---

### AC 5 Order status enum table

`order_status_enum` table has to be created with constrains:

| column       | type        | constrains      |
| ------------ | ----------- | --------------- |
| order_status | VARCHAR(50) | NOT NULL UNIQUE |

---

### AC 6 Event name enum table

`event_name_enum` table has to be created with constrains:

| column     | type        | constrains      |
| ---------- | ----------- | --------------- |
| event_name | VARCHAR(50) | NOT NULL UNIQUE |
