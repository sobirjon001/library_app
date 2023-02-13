module.exports = schema = {
  create_user: {
    title: "new user",
    description: "describes properties required to create a user",
    type: "object",
    properties: {
      first_name: {
        type: "string",
        description: "user first name",
        maxLength: 20,
      },
      last_name: {
        type: "string",
        description: "user last name",
        maxLength: 20,
        // message: "Must be no more that 20 characters",
      },
      dob: {
        type: "string",
        description: "user's date of birth",
      },
      user_login: {
        type: "string",
        description: "user's login name",
        maxLength: 20,
      },
      password: {
        type: "string",
        description: "user's password",
        maxLength: 20,
      },
      e_mail: {
        type: "string",
        description: "user's e-mail",
      },
      phone_number: {
        type: ["string", "integer"],
        description: "user's phone number",
      },
    },
    required: [
      "first_name",
      "last_name",
      "dob",
      "user_login",
      "password",
      "e_mail",
      "phone_number",
    ],
    additionalProperties: false,
  },
  update_user: {
    title: "new user",
    description: "describes properties required to create a user",
    type: "object",
    properties: {
      user_id: {
        type: ["string", "integer"],
        description: "user's id",
      },
      first_name: {
        type: "string",
        description: "user first name",
        maxLength: 20,
      },
      last_name: {
        type: "string",
        description: "user last name",
        maxLength: 20,
      },
      dob: {
        type: "string",
        description: "user's date of birth",
      },
      user_login: {
        type: "string",
        description: "user's login name",
        maxLength: 20,
      },
      password: {
        type: "string",
        description: "user's password",
        maxLength: 20,
      },
      e_mail: {
        type: "string",
        description: "user's e-mail",
      },
      phone_number: {
        type: ["string", "integer"],
        description: "user's phone number",
      },
    },
    required: ["user_id"],
    additionalProperties: false,
  },
  create_role: {
    title: "new role",
    description: "describes properties required to create a role",
    type: "object",
    properties: {
      role_name: {
        type: "string",
        description: "role name",
        maxLength: 20,
      },
      can_create_role: {
        type: "boolean",
        description: "has clearance to create new roles",
      },
      can_modify_role: {
        type: "boolean",
        description: "has clearance to modify new roles",
      },
      can_delete_role: {
        type: "boolean",
        description: "has clearance to delete new roles",
      },
      can_order: {
        type: "boolean",
        description: "has clearance to place new order",
      },
      can_create_order: {
        type: "boolean",
        description: "has clearance to create new order",
      },
      can_modify_order: {
        type: "boolean",
        description: "has clearance to modify order",
      },
      can_delete_order: {
        type: "boolean",
        description: "has clearance to delete order",
      },
      can_create_user: {
        type: "boolean",
        description: "has clearance to create new user",
      },
      can_modify_user: {
        type: "boolean",
        description: "has clearance to modify user",
      },
      can_delete_user: {
        type: "boolean",
        description: "has clearance to delete user",
      },
      can_create_book: {
        type: "boolean",
        description: "has clearance to create book",
      },
      can_modify_book: {
        type: "boolean",
        description: "has clearance to modify book",
      },
      can_delete_book: {
        type: "boolean",
        description: "has clearance to delete book",
      },
      can_read_events: {
        type: "boolean",
        description: "has clearance to read events",
      },
    },
    required: [
      "role_name",
      "can_create_role",
      "can_modify_role",
      "can_delete_role",
      "can_order",
      "can_create_order",
      "can_modify_order",
      "can_delete_order",
      "can_create_user",
      "can_modify_user",
      "can_delete_user",
      "can_create_book",
      "can_modify_book",
      "can_delete_book",
      "can_read_events",
    ],
    additionalProperties: false,
  },
  update_role: {
    title: "update role",
    description: "describes properties required to create a role",
    type: "object",
    properties: {
      role_id: {
        type: "integer",
        description: "role's id",
      },
      role_name: {
        type: "string",
        description: "role name",
        maxLength: 20,
      },
      can_create_role: {
        type: "boolean",
        description: "has clearance to create new roles",
      },
      can_modify_role: {
        type: "boolean",
        description: "has clearance to modify new roles",
      },
      can_delete_role: {
        type: "boolean",
        description: "has clearance to delete new roles",
      },
      can_order: {
        type: "boolean",
        description: "has clearance to place new order",
      },
      can_create_order: {
        type: "boolean",
        description: "has clearance to create new order",
      },
      can_modify_order: {
        type: "boolean",
        description: "has clearance to modify order",
      },
      can_delete_order: {
        type: "boolean",
        description: "has clearance to delete order",
      },
      can_create_user: {
        type: "boolean",
        description: "has clearance to create new user",
      },
      can_modify_user: {
        type: "boolean",
        description: "has clearance to modify user",
      },
      can_delete_user: {
        type: "boolean",
        description: "has clearance to delete user",
      },
      can_create_book: {
        type: "boolean",
        description: "has clearance to create book",
      },
      can_modify_book: {
        type: "boolean",
        description: "has clearance to modify book",
      },
      can_delete_book: {
        type: "boolean",
        description: "has clearance to delete book",
      },
      can_read_events: {
        type: "boolean",
        description: "has clearance to read events",
      },
    },
    required: [
      "role_id",
      "role_name",
      "can_create_role",
      "can_modify_role",
      "can_delete_role",
      "can_order",
      "can_create_order",
      "can_modify_order",
      "can_delete_order",
      "can_create_user",
      "can_modify_user",
      "can_delete_user",
      "can_create_book",
      "can_modify_book",
      "can_delete_book",
      "can_read_events",
    ],
    additionalProperties: false,
  },
  create_account: {
    title: "new account",
    description: "creating account, which is a combitation of user and role",
    type: "object",
    properties: {
      user_id: {
        type: ["string", "integer"],
        description: "user id from user profile",
      },
      role_id: {
        type: ["string", "integer"],
        description: "role id form account sets",
      },
      account_status: {
        type: "string",
        description: "account status, that desides clearance",
        maxLength: 20,
      },
      termination_date: {
        type: ["null", "string"],
        description: "account termination date, that desides clearance",
      },
    },
    required: ["user_id", "role_id", "account_status"],
    additionalProperties: false,
  },
  update_account: {
    title: "update account",
    description: "creating account, which is a combitation of user and role",
    type: "object",
    properties: {
      account_id: {
        type: ["string", "integer"],
        description: "account id represents combination of user and role",
      },
      user_id: {
        type: ["string", "integer"],
        description: "user id from user profile",
      },
      role_id: {
        type: ["string", "integer"],
        description: "role id form account sets",
      },
      account_status: {
        type: "string",
        description: "account status, that desides clearance",
        maxLength: 20,
      },
      termination_date: {
        type: ["null", "string"],
        description: "account termination date, that desides clearance",
      },
    },
    required: ["account_id", "account_status", "termination_date"],
    additionalProperties: false,
  },
  student_employeesign_up: {
    title: "new student/employee sign up",
    description:
      "describes properties required to create a user with studen/employee aplicant role",
    type: "object",
    properties: {
      first_name: {
        type: "string",
        description: "user first name",
        maxLength: 20,
      },
      last_name: {
        type: "string",
        description: "user last name",
        maxLength: 20,
      },
      dob: {
        type: "string",
        description: "user's date of birth",
      },
      user_login: {
        type: "string",
        description: "user's login name",
        maxLength: 20,
      },
      password: {
        type: "string",
        description: "user's password",
        maxLength: 20,
      },
      e_mail: {
        type: "string",
        description: "user's e-mail",
      },
      phone_number: {
        type: ["string", "integer"],
        description: "user's phone number",
      },
      role_name: {
        type: "string",
        description: "role name",
        maxLength: 20,
      },
      account_status: {
        type: "string",
        description: "account status, that desides clearance",
        maxLength: 20,
      },
      termination_date: {
        type: ["null", "string"],
        description: "account termination date, that desides clearance",
      },
    },
    required: [
      "first_name",
      "last_name",
      "dob",
      "user_login",
      "password",
      "e_mail",
      "phone_number",
      "role_name",
      "account_status",
      "termination_date",
    ],
    additionalProperties: false,
  },
};
