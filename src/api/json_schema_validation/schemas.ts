import { JSONSchemaType } from 'ajv'
import { Account, Role, SignUp, UpdateAccount, UpdateRole, UpdateUser, User } from '../../conf/types'

export const create_user: JSONSchemaType<User> = {
  type: 'object',
  properties: {
    first_name: { type: 'string', maxLength: 20 },
    last_name: { type: 'string', maxLength: 20 },
    dob: { type: 'string' },
    user_login: { type: 'string', maxLength: 20 },
    password: { type: 'string', maxLength: 20 },
    e_mail: { type: 'string' },
    phone_number: { type: ['string', 'number'] },
    decodedUser: { type: 'object', nullable: true },
  },
  required: ['first_name', 'last_name', 'dob', 'user_login', 'password', 'e_mail', 'phone_number'],
  additionalProperties: false,
}

export const update_user: JSONSchemaType<UpdateUser> = {
  type: 'object',
  properties: {
    user_id: { type: 'number' },
    first_name: { type: 'string', maxLength: 20 },
    last_name: { type: 'string', maxLength: 20 },
    dob: { type: 'string' },
    user_login: { type: 'string', maxLength: 20 },
    password: { type: 'string', maxLength: 20 },
    e_mail: { type: 'string' },
    phone_number: { type: ['string', 'number'] },
    decodedUser: { type: 'object', nullable: true },
  },
  required: ['user_id'],
  additionalProperties: false,
}

export const create_role: JSONSchemaType<Role> = {
  type: 'object',
  properties: {
    role_name: { type: 'string' },
    can_read_role: { type: 'boolean' },
    can_create_role: { type: 'boolean' },
    can_modify_role: { type: 'boolean' },
    can_delete_role: { type: 'boolean' },
    can_read_order: { type: 'boolean' },
    can_create_order: { type: 'boolean' },
    can_modify_order: { type: 'boolean' },
    can_delete_order: { type: 'boolean' },
    can_read_user: { type: 'boolean' },
    can_create_user: { type: 'boolean' },
    can_modify_user: { type: 'boolean' },
    can_delete_user: { type: 'boolean' },
    can_read_book: { type: 'boolean' },
    can_create_book: { type: 'boolean' },
    can_modify_book: { type: 'boolean' },
    can_delete_book: { type: 'boolean' },
    can_read_events: { type: 'boolean' },
    decodedUser: { type: 'object', nullable: true },
  },
  required: [
    'role_name',
    'can_read_role',
    'can_create_role',
    'can_modify_role',
    'can_delete_role',
    'can_read_order',
    'can_create_order',
    'can_modify_order',
    'can_delete_order',
    'can_read_user',
    'can_create_user',
    'can_modify_user',
    'can_delete_user',
    'can_read_book',
    'can_create_book',
    'can_modify_book',
    'can_delete_book',
    'can_read_events',
  ],
  additionalProperties: false,
}

export const update_role: JSONSchemaType<UpdateRole> = {
  type: 'object',
  properties: {
    role_id: { type: 'number' },
    role_name: { type: 'string' },
    can_read_role: { type: 'boolean' },
    can_create_role: { type: 'boolean' },
    can_modify_role: { type: 'boolean' },
    can_delete_role: { type: 'boolean' },
    can_read_order: { type: 'boolean' },
    can_create_order: { type: 'boolean' },
    can_modify_order: { type: 'boolean' },
    can_delete_order: { type: 'boolean' },
    can_read_user: { type: 'boolean' },
    can_create_user: { type: 'boolean' },
    can_modify_user: { type: 'boolean' },
    can_delete_user: { type: 'boolean' },
    can_read_book: { type: 'boolean' },
    can_create_book: { type: 'boolean' },
    can_modify_book: { type: 'boolean' },
    can_delete_book: { type: 'boolean' },
    can_read_events: { type: 'boolean' },
    decodedUser: { type: 'object', nullable: true },
  },
  required: [
    'role_id',
    'role_name',
    'can_read_role',
    'can_create_role',
    'can_modify_role',
    'can_delete_role',
    'can_read_order',
    'can_create_order',
    'can_modify_order',
    'can_delete_order',
    'can_read_user',
    'can_create_user',
    'can_modify_user',
    'can_delete_user',
    'can_read_book',
    'can_create_book',
    'can_modify_book',
    'can_delete_book',
    'can_read_events',
  ],
  additionalProperties: false,
}

export const create_account: JSONSchemaType<Account> = {
  type: 'object',
  properties: {
    user_id: { type: 'number' },
    role_id: { type: 'number' },
    account_status: { type: 'string', maxLength: 20 },
    termination_date: { type: 'string', nullable: true },
    decodedUser: { type: 'object', nullable: true },
  },
  required: ['user_id', 'role_id', 'account_status'],
  additionalProperties: false,
}

export const update_account: JSONSchemaType<UpdateAccount> = {
  type: 'object',
  properties: {
    account_id: { type: 'number' },
    user_id: { type: 'number' },
    role_id: { type: 'number' },
    account_status: { type: 'string', maxLength: 20 },
    termination_date: { type: 'string', nullable: true },
    decodedUser: { type: 'object', nullable: true },
  },
  required: ['account_id'],
  additionalProperties: false,
}

export const sign_up: JSONSchemaType<SignUp> = {
  title: 'new student/employee sign up',
  description: 'describes properties required to create a user with studen/employee aplicant role',
  type: 'object',
  properties: {
    first_name: {
      type: 'string',
      description: 'user first name',
      maxLength: 20,
    },
    last_name: {
      type: 'string',
      description: 'user last name',
      maxLength: 20,
    },
    dob: {
      type: 'string',
      description: "user's date of birth",
    },
    user_login: {
      type: 'string',
      description: "user's login name",
      maxLength: 20,
    },
    password: {
      type: 'string',
      description: "user's password",
      maxLength: 20,
    },
    e_mail: {
      type: 'string',
      description: "user's e-mail",
    },
    phone_number: {
      type: ['string', 'integer'],
      description: "user's phone number",
    },
    role_name: {
      type: 'string',
      description: 'role name',
      maxLength: 20,
    },
    account_status: {
      type: 'string',
      description: 'account status, that desides clearance',
      maxLength: 20,
    },
    termination_date: {
      type: 'string',
      description: 'account termination date, that desides clearance',
      nullable: true,
    },
    decodedUser: { type: 'object', nullable: true },
  },
  required: ['first_name', 'last_name', 'dob', 'user_login', 'password', 'e_mail', 'phone_number', 'role_name', 'account_status'],
  additionalProperties: false,
}
