[Home](../library_app_project.md) | [LA-1 DB Database infrastructure](./LA-1_DB_databse_feature.md)

# LA-22 DB API endpoinds tables

## Description

In roeder to controll api endpoints and manage clearance controll all api endpoints will be stored, monitored and access to them will be saved in database tables.

## Acceptance criteria:

### AC 1 API endpoints table

`api_endpoints` table has to be created with constrains:

| column          | type         | constrains                 |
| --------------- | ------------ | -------------------------- |
| api_id          | INT          | AUTO_INCREMENT PRIMARY KEY |
| api_name        | VARCHAR(50)  |                            |
| api_description | VARCHAR(255) |                            |
| microservice    | VARCHAR(50)  |                            |
| api_endpoint    | VARCHAR(50)  | NOT NULL                   |

---

### AC 2 API access table

`api_access` table has to be created with constrains:

| column      | type    | constrains                 |
| ----------- | ------- | -------------------------- |
| user_api_id | INT     | AUTO_INCREMENT PRIMARY KEY |
| account_id  | INT     | NOT NULL                   |
| api_id      | INT     | NOT NULL                   |
| access      | BOOLEAN | DEFAULT TRUE               |

| Primary and foreign key references                       |
| -------------------------------------------------------- |
| FOREIGN KEY (account_id) REFERENCES accounts(account_id) |
| FOREIGN KEY (api_id) REFERENCES api_endpoints(api_id)    |
