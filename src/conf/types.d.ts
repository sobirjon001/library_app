export interface Obj {
  [key: string]: any
}

export interface TableStructure extends Obj {
  name: string
  query: string
}

export interface Role extends Obj {
  role_id?: number
  role_name: string
  can_create_role: boolean
  can_modify_role: boolean
  can_delete_role: boolean
  can_order: boolean
  can_create_order: boolean
  can_modify_order: boolean
  can_delete_order: boolean
  can_create_user: boolean
  can_modify_user: boolean
  can_delete_user: boolean
  can_create_book: boolean
  can_modify_book: boolean
  can_delete_book: boolean
  can_read_events: boolean
}
