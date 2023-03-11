export interface Obj {
  [key: string]: any
}

export interface TableStructure extends Obj {
  name: string
  query: string
}

export interface User {
  first_name: string
  last_name: string
  dob: string
  user_login: string
  password: string
  e_mail: string
  phone_number: string | number
}

export interface UpdateUser extends User {
  user_id: number
}

export interface Role {
  role_name: string
  can_read_role: boolean
  can_create_role: boolean
  can_modify_role: boolean
  can_delete_role: boolean
  can_read_order: boolean
  can_create_order: boolean
  can_modify_order: boolean
  can_delete_order: boolean
  can_read_user: boolean
  can_create_user: boolean
  can_modify_user: boolean
  can_delete_user: boolean
  can_read_book: boolean
  can_create_book: boolean
  can_modify_book: boolean
  can_delete_book: boolean
  can_read_events: boolean
}

export type Access_scope =
  | 'can_read_role'
  | 'can_create_role'
  | 'can_modify_role'
  | 'can_delete_role'
  | 'can_read_order'
  | 'can_create_orde'
  | 'can_modify_orde'
  | 'can_delete_orde'
  | 'can_read_user'
  | 'can_create_user'
  | 'can_modify_user'
  | 'can_delete_user'
  | 'can_read_book'
  | 'can_create_book'
  | 'can_modify_book'
  | 'can_delete_book'
  | 'can_read_events'

export interface UpdateRole extends Role {
  role_id: number
}

export interface Account {
  user_id: number
  role_id: number
  account_status: string
  termination_date?: string | null
}

export interface UpdateAccount extends Account {
  account_id: number
}

export interface SignUp {
  first_name: string
  last_name: string
  dob: string
  user_login: string
  password: string
  e_mail: string
  phone_number: string | number
  role_name: string
  account_status: string
  termination_date?: string
}
