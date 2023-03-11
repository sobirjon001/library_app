import { MysqlError } from 'mysql'
import { pool } from '../database/mysql'

export const save_to_sign_up_roles_db = (role_names: string[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`insert ignore into sign_up_roles(role_name) values ('${role_names.join("'),\n('")}');`, callback)
}

export const get_sign_up_roles_db = (callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from sign_up_roles`, callback)
}

export const save_to_account_status_enum_db = (account_statuses: string[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`insert ignore into account_status_enum(account_status) values ('${account_statuses.join("'),\n('")}');`, callback)
}

export const get_account_status_enum_db = (callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from account_status_enum`, callback)
}
