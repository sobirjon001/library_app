[Home](../library_app_project.md) | [LA-1 DB Database infrastructure](./LA-1_DB_databse_feature.md)

# LA-24 DB Events table

## Description

Every time any user performs action they will be saved in `events` table for tracking purposes and historical refference.

## Acceptance criteria:

### AC 1 Events table

`events` table has to be created with constrains:

| column         | type          | constrains                 |
| -------------- | ------------- | -------------------------- |
| event_id       | INT           | AUTO_INCREMENT PRIMARY KEY |
| event_name     | VARCHAR(20)   | NOT NULL                   |
| created_by     | INT           | NOT NULL                   |
| created_on     | date          | NOT NULL                   |
| correlation_id | INT           | NOT NULL                   |
| data           | VARCHAR(2000) |                            |
