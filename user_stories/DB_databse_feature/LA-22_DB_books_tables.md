[Home](../library_app_project.md) | [LA-1 DB Database infrastructure](./LA-1_DB_databse_feature.md)

# LA-22 DB Books tables

## Description

All books are stored in `books` table. Each book is registered by book keeper. Each book can have different condition, It can be in stock or in students hands. Book description is saved in `book_description` table. Many books can have same description as a hard copies.

## Acceptance criteria:

### AC 1 Book descriptions table

`book_description` table has to be created with constrains:

| column              | type         | constrains                 |
| ------------------- | ------------ | -------------------------- |
| book_description_id | INT          | AUTO_INCREMENT PRIMARY KEY |
| title               | VARCHAR(255) | NOT NULL UNIQUE            |
| genre               | VARCHAR(50)  |                            |
| author              | VARCHAR(50)  |                            |
| published_year      | year         |                            |
| age_restriction     | VARCHAR(20)  |                            |

---

### AC 2 Book table

`book` table has to be created with constrains:

| column              | type        | constrains                 |
| ------------------- | ----------- | -------------------------- |
| book_id             | INT         | AUTO_INCREMENT PRIMARY KEY |
| book_description_id | INT         | NOT NULL                   |
| book_condition      | VARCHAR(20) |                            |
| book_availability   | VARCHAR(20) | NOT NULL                   |

| Primary and foreign key references                                                 |
| ---------------------------------------------------------------------------------- |
| FOREIGN KEY (book_description_id) REFERENCES book_description(book_description_id) |
