// import libraries
import { Router } from 'express'
const user_router = Router()
import {
  create_user,
  delete_users_by_user_ids,
  get_all_users,
  get_user_by_id,
  search_for_user,
  update_user,
  create_role,
  get_all_roles,
  get_role_by_role_id,
  update_role,
  delete_roles_by_role_ids,
  get_protected_users,
  set_protected_users,
  get_protected_roles,
  set_protected_roles,
  remove_user_protection,
  remove_role_protection,
  get_role_by_role_name,
  create_account,
  delete_accounts_by_account_ids,
  get_account_info_by_account_id,
  get_role_names_by_user_id,
  student_employee_sign_up,
  update_account,
  get_account_info_by_user_login,
} from './users.controller'
import { validateSchema } from '../json_schema_validation/json_schema_validator'
import { checkToken, clearance, decodeUser, login } from '../authentication/authentication'

user_router.get('/', checkToken, clearance(['can_read_user']), get_all_users)
user_router.get('/decode', checkToken, decodeUser)
user_router.get('/search', checkToken, clearance(['can_read_user']), search_for_user)
user_router.get('/protected', checkToken, clearance(['can_read_user']), get_protected_users)
user_router.get('/protected_roles', checkToken, clearance(['can_read_role']), get_protected_roles)
user_router.get('/all_roles', get_all_roles)
user_router.get('/role_by_role_name', checkToken, clearance(['can_read_role']), get_role_by_role_name)
user_router.get('/role/:id', checkToken, clearance(['can_read_role']), get_role_by_role_id)
user_router.get('/account', checkToken, clearance(['can_read_user', 'can_read_role']), get_account_info_by_user_login)
user_router.get('/account/:id', checkToken, clearance(['can_read_user', 'can_read_role']), get_account_info_by_account_id)
user_router.get('/role_names_by_user_id/:id', checkToken, clearance(['can_read_user', 'can_read_role']), get_role_names_by_user_id)
user_router.get('/:id', checkToken, clearance(['can_read_user']), get_user_by_id)
user_router.post('/', checkToken, clearance(['can_create_user']), validateSchema('new-user'), create_user)
user_router.post('/login', login)
user_router.post('/protected', checkToken, clearance(['can_delete_user']), set_protected_users)
user_router.post('/role', checkToken, clearance(['can_create_role']), validateSchema('new-role'), create_role)
user_router.post('/protected_roles', checkToken, clearance(['can_delete_role']), set_protected_roles)
user_router.post('/account', checkToken, clearance(['can_create_user', 'can_create_role']), validateSchema('create-account'), create_account)
user_router.post('/sign_up', validateSchema('sign-up'), student_employee_sign_up)
user_router.patch('/', checkToken, clearance(['can_modify_user']), validateSchema('update-user'), update_user)
user_router.patch('/role', checkToken, clearance(['can_modify_role']), validateSchema('update-role'), update_role)
user_router.patch('/protected', checkToken, clearance(['can_delete_user']), remove_user_protection)
user_router.patch('/protected_roles', checkToken, clearance(['can_delete_role']), remove_role_protection)
user_router.patch('/account', checkToken, clearance(['can_modify_user', 'can_modify_role']), validateSchema('update-account'), update_account)
user_router.delete('/', checkToken, clearance(['can_delete_user']), delete_users_by_user_ids)
user_router.delete('/roles', checkToken, clearance(['can_delete_role']), delete_roles_by_role_ids)
user_router.delete('/account', checkToken, clearance(['can_delete_user', 'can_delete_role']), delete_accounts_by_account_ids)

export { user_router }
