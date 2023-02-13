import { Role } from '../../conf/types'

export const system_roles: Role[] = [
  {
    role_name: 'QA',
    can_create_role: true,
    can_modify_role: true,
    can_delete_role: true,
    can_order: true,
    can_create_order: true,
    can_modify_order: true,
    can_delete_order: true,
    can_create_user: true,
    can_modify_user: true,
    can_delete_user: true,
    can_create_book: true,
    can_modify_book: true,
    can_delete_book: true,
    can_read_events: true,
  },
  {
    role_name: 'student',
    can_create_role: false,
    can_modify_role: false,
    can_delete_role: false,
    can_order: true,
    can_create_order: false,
    can_modify_order: false,
    can_delete_order: false,
    can_create_user: false,
    can_modify_user: false,
    can_delete_user: false,
    can_create_book: false,
    can_modify_book: false,
    can_delete_book: false,
    can_read_events: false,
  },
]

export const sign_up_roles: string[] = ['student', 'new hire applicant']

export const account_statuses: string[] = ['active', 'new hire onboarding']
