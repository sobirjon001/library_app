module.exports = [
  {
    name: "users",
    query: `CREATE TABLE users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(20) NOT NULL,
      last_name VARCHAR(20) NOT NULL,
      dob DATE NOT NULL,
      user_login VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      e_mail VARCHAR(100) NOT NULL UNIQUE,
      phone_number VARCHAR(10) UNIQUE
    );`,
  },
  {
    name: "roles",
    query: `CREATE TABLE roles (
      role_id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(20) NOT NULL UNIQUE,
      can_create_role BOOLEAN DEFAULT FALSE,
      can_modify_role BOOLEAN DEFAULT FALSE,
      can_delete_role BOOLEAN DEFAULT FALSE,
      can_order BOOLEAN DEFAULT FALSE,
      can_create_order BOOLEAN DEFAULT FALSE,
      can_modify_order BOOLEAN DEFAULT FALSE,
      can_delete_order BOOLEAN DEFAULT FALSE,
      can_create_user BOOLEAN DEFAULT FALSE,
      can_modify_user BOOLEAN DEFAULT FALSE,
      can_delete_user BOOLEAN DEFAULT FALSE,
      can_create_book BOOLEAN DEFAULT FALSE,
      can_modify_book BOOLEAN DEFAULT FALSE,
      can_delete_book BOOLEAN DEFAULT FALSE,
      can_read_events BOOLEAN DEFAULT FALSE
    );`,
  },
  {
    name: "accounts",
    query: `CREATE TABLE accounts (
      account_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      role_id INT NOT NULL,
      account_status VARCHAR(20) NOT NULL,
      termination_date date NULL DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (role_id) REFERENCES roles(role_id)
    );`,
  },
  {
    name: "api_endpoints",
    query: `CREATE TABLE api_endpoints (
      api_id INT AUTO_INCREMENT PRIMARY KEY,
      api_name VARCHAR(50),
      api_description VARCHAR(255),
      microservice VARCHAR(50),
      api_endpoint VARCHAR(50) NOT NULL
    );`,
  },
  {
    name: "api_access",
    query: `CREATE TABLE api_access (
      user_api_id INT AUTO_INCREMENT PRIMARY KEY,
      account_id INT NOT NULL,
      api_id INT NOT NULL,
      access BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (account_id) REFERENCES accounts(account_id),
      FOREIGN KEY (api_id) REFERENCES api_endpoints(api_id)
    );`,
  },
  {
    name: "book_description",
    query: `CREATE TABLE book_description (
      book_description_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      genre VARCHAR(50),
      author VARCHAR(50),
      published_year year,
      age_restriction VARCHAR(20)
    );`,
  },
  {
    name: "book",
    query: `CREATE TABLE book (
      book_id INT AUTO_INCREMENT PRIMARY KEY,
      book_description_id INT NOT NULL,
      book_condition VARCHAR(20),
      book_availability VARCHAR(20) NOT NULL,
      FOREIGN KEY (book_description_id) REFERENCES book_description(book_description_id)
    );`,
  },
  {
    name: "orders",
    query: `CREATE TABLE orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      created_by INT NOT NULL,
      created_on date NOT NULL,
      updated_by INT NULL DEFAULT NULL,
      updated_on date NULL DEFAULT NULL,
      account_id INT NOT NULL,
      order_status VARCHAR(20) NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(account_id)
    );`,
  },
  {
    name: "basket",
    query: `CREATE TABLE basket (
      order_id INT NOT NULL,
      book_id INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (book_id) REFERENCES book(book_id)
    );`,
  },
  {
    name: "events",
    query: `CREATE TABLE events (
      event_id INT AUTO_INCREMENT PRIMARY KEY,
      event_name VARCHAR(20) NOT NULL,
      created_by INT NOT NULL,
      created_on date NOT NULL,
      correlation_id INT NOT NULL,
      data VARCHAR(2000)
    );`,
  },
  {
    name: "account_status_enum",
    query: `CREATE TABLE account_status_enum (
      account_status VARCHAR(50) NOT NULL UNIQUE
    );`,
  },
  {
    name: "book_condition_enum",
    query: `CREATE TABLE book_condition_enum (
      book_condition VARCHAR(50) NOT NULL UNIQUE
    );`,
  },
  {
    name: "book_availability_enum",
    query: `CREATE TABLE book_availability_enum (
      book_availability VARCHAR(50) NOT NULL UNIQUE
    );`,
  },
  {
    name: "age_restriction_enum",
    query: `CREATE TABLE age_restriction_enum (
      age_restriction VARCHAR(50) NOT NULL UNIQUE
    );`,
  },
  {
    name: "order_status_enum",
    query: `CREATE TABLE order_status_enum (
      order_status VARCHAR(50) NOT NULL UNIQUE
    );`,
  },
  {
    name: "event_name_enum",
    query: `CREATE TABLE event_name_enum (
      event_name VARCHAR(50) NOT NULL UNIQUE
    );`,
  },
];
