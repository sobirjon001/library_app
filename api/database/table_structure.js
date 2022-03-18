module.exports = [
  {
    name: "users",
    query: `create table users (
      user_id int auto_increment primary key,
      first_name varchar(20) not null,
      last_name varchar(20) not null,
      dob date not null,
      account_login varchar(20) not null,
      password varchar(100) not null,
      e_mail varchar(100) not null,
      phone_number int(10),
      unique (account_login,e_mail,phone_number)
    );`,
  },
  {
    name: "roles",
    query: `create table roles (
        role_id int auto_increment primary key,
        role_name varchar(20) not null,
        can_create_role boolean default false,
        can_modify_role boolean default false,
        can_delete_role boolean default false,
        can_order boolean default false,
        can_create_order boolean default false,
        can_modify_order boolean default false,
        can_delete_order boolean default false,
        can_create_user boolean default false,
        can_modify_user boolean default false,
        can_delete_user boolean default false,
        can_create_book boolean default false,
        can_modify_book boolean default false,
        can_delete_book boolean default false,
        can_read_events boolean default false
      );`,
  },
  {
    name: "user_roles",
    query: `create table user_roles (
      user_role_id int auto_increment primary key,
      user_id int not null,
      role_id int not null,
      user_role_status varchar(20) not null,
      termination_date date null default null,
      foreign key (user_id) references users(user_id),
      foreign key (role_id) references roles(role_id)
    );`,
  },
  {
    name: "api_endpoints",
    query: `create table api_endpoints (
      api_id int auto_increment primary key,
      name varchar(50),
      description varchar(255),
      microservice varchar(50),
      endpoint varchar(50) not null
    )`,
  },
  {
    name: "api_access",
    query: `create table api_access (
      user_role_api_id int auto_increment primary key,
      user_role_id int not null,
      api_id int not null,
      access boolean default true,
      foreign key (user_role_id) references user_roles(user_role_id),
      foreign key (api_id) references api_endpoints(api_id)
    );`,
  },
  {
    name: "book_description",
    query: `create table book_description (
      book_description_id int auto_increment primary key,
      title varchar(255) not null,
      genre varchar(50),
      author varchar(50),
      published_year year,
      age_restriction varchar(20),
      unique (title)
    );`,
  },
  {
    name: "book",
    query: `create table book (
      book_id int auto_increment primary key,
      book_description_id int not null,
      book_condition varchar(20),
      book_availability varchar(20) not null,
      foreign key (book_description_id) references book_description(book_description_id)
    );`,
  },
  {
    name: "orders",
    query: `create table orders (
      order_id int auto_increment primary key,
      created_by int not null,
      created_on date not null,
      updated_by int null default null,
      updated_on date null default null,
      customer_id int not null,
      order_status varchar(20) not null,
      foreign key (customer_id) references user_roles(user_role_id)
    );`,
  },
  {
    name: "basket",
    query: `create table basket (
      order_id int not null,
      book_id int not null,
      foreign key (order_id) references orders(order_id),
      foreign key (book_id) references book(book_id)
    );`,
  },
  {
    name: "events",
    query: `create table events (
      event_id int auto_increment primary key,
      event_name varchar(20) not null,
      created_by int not null,
      created_on date not null,
      correlation_id int not null,
      data varchar(2000)
    );`,
  },
  {
    name: "user_role_status_enum",
    query: `create table user_role_status_enum (
      user_role_status varchar(50) not null
    );`,
  },
  {
    name: "book_condition_enum",
    query: `create table book_condition_enum (
      book_condition varchar(50) not null
    );`,
  },
  {
    name: "book_availability_enum",
    query: `create table book_availability_enum (
      book_availability varchar(50) not null
    );`,
  },
  {
    name: "age_restriction_enum",
    query: `create table age_restriction_enum (
      age_restriction varchar(50) not null
    );`,
  },
  {
    name: "order_status_enum",
    query: `create table order_status_enum (
      order_status varchar(50) not null
    );`,
  },
  {
    name: "event_name_enum",
    query: `create table event_name_enum (
      event_name varchar(50) not null
    );`,
  },
];
