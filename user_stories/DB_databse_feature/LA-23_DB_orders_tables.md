[Home](../library_app_project.md) | [LA-1 DB Database infrastructure](./LA-1_DB_databse_feature.md)

# LA-23 DB Orders tables

## Description

Studen will be able to place desired books to basket and `basket` table will store those books. Once basket is ready for order Order will be created and stored in `orders` table. This Orders will be proccessed by librarian.

## Acceptance criteria:

### AC 1 Orders table

`orders` table has to be created with constrains:

| column       | type        | constrains                 |
| ------------ | ----------- | -------------------------- |
| order_id     | INT         | AUTO_INCREMENT PRIMARY KEY |
| created_by   | INT         | NOT NULL                   |
| created_on   | date        | NOT NULL                   |
| updated_by   | INT         | NULL DEFAULT NULL          |
| updated_on   | date        | NULL DEFAULT NULL          |
| account_id   | INT         | NOT NULL                   |
| order_status | VARCHAR(20) | NOT NULL                   |

| Primary and foreign key references                       |
| -------------------------------------------------------- |
| FOREIGN KEY (account_id) REFERENCES accounts(account_id) |

---

### AC 2 Basket table

`basket` table has to be created with constrains:

| column   | type | constrains |
| -------- | ---- | ---------- |
| order_id | INT  | NOT NULL   |
| book_id  | INT  | NOT NULL   |

| Primary and foreign key references                 |
| -------------------------------------------------- |
| FOREIGN KEY (order_id) REFERENCES orders(order_id) |
| FOREIGN KEY (book_id) REFERENCES book(book_id)     |
