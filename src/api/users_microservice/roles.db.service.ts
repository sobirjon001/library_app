import { MysqlError } from 'mysql'
import { Account, Obj, Role, UpdateAccount } from '../../conf/types'
import { pool } from '../database/mysql'

export const create_role_db = (data: Role, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `insert into roles (
        role_name,
        can_read_role,
        can_create_role,
        can_modify_role,
        can_delete_role,
        can_read_order,
        can_create_order,
        can_modify_order,
        can_delete_order,
        can_read_user,
        can_create_user,
        can_modify_user,
        can_delete_user,
        can_read_book,
        can_create_book,
        can_modify_book,
        can_delete_book,
        can_read_events
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      data.role_name,
      data.can_read_role,
      data.can_create_role,
      data.can_modify_role,
      data.can_delete_role,
      data.can_read_order,
      data.can_create_order,
      data.can_modify_order,
      data.can_delete_order,
      data.can_read_user,
      data.can_create_user,
      data.can_modify_user,
      data.can_delete_user,
      data.can_read_book,
      data.can_create_book,
      data.can_modify_book,
      data.can_delete_book,
      data.can_read_events,
    ],
    (err: MysqlError | null, res: any) => {
      callback(err, res)
    }
  )
}

export const get_all_roles_db = (callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from roles`, callback)
}

export const get_role_by_role_id_db = (id: number, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from roles where role_id = ?`, [id], callback)
}

export const get_role_by_role_name_db = (role_name: string, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from roles where role_name = ?`, [role_name], callback)
}

export const update_role_db = (data: Obj, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `update roles set
      role_name = ?,
      can_read_role = ?,
      can_create_role = ?,
      can_modify_role = ?,
      can_delete_role = ?,
      can_read_order = ?,
      can_create_order = ?,
      can_modify_order = ?,
      can_delete_order = ?,
      can_read_user = ?,
      can_create_user = ?,
      can_modify_user = ?,
      can_delete_user = ?,
      can_read_book = ?,
      can_create_book = ?,
      can_modify_book = ?,
      can_delete_book = ?,
      can_read_events = ?
    where role_id = ?;`,
    [
      data.role_name,
      data.can_read_role,
      data.can_create_role,
      data.can_modify_role,
      data.can_delete_role,
      data.can_read_order,
      data.can_create_order,
      data.can_modify_order,
      data.can_delete_order,
      data.can_read_user,
      data.can_create_user,
      data.can_modify_user,
      data.can_delete_user,
      data.can_read_book,
      data.can_create_book,
      data.can_modify_book,
      data.can_delete_book,
      data.can_read_events,
      data.role_id,
    ],
    callback
  )
}

export const check_existing_role_ids_db = (ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select role_id from roles where role_id in (?)`, [ids], callback)
}

export const delete_role_by_role_ids_db = (role_ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`delete from roles where role_id in (?);`, [role_ids], callback)
}

export const create_account_db = (data: Account, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `insert into accounts (
        user_id,
        role_id,
        account_status,
        termination_date
      )
      values(?, ?, ?, ?);`,
    [data.user_id, data.role_id, data.account_status, data.termination_date],
    callback
  )
}

export const update_account_db = (data: UpdateAccount, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `update accounts set
        account_status = ?,
        termination_date = ?
      where account_id = ?;`,
    [data.account_status, data.termination_date, data.account_id],
    callback
  )
}

export const get_role_names_by_user_id_db = (user_id: number, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `SELECT r.role_id, r.role_name, ac.account_id, ac.account_status, ac.termination_date
      FROM roles r
      LEFT JOIN accounts ac on r.role_id = ac.role_id
      LEFT JOIN users u on ac.user_id = u.user_id
      WHERE u.user_id = ?;`,
    [user_id],
    callback
  )
}

export const get_account_info_by_account_id_db = (account_id: number, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `SELECT u.*, ac.*, r.*
      FROM accounts ac 
      LEFT JOIN users u on ac.user_id = u.user_id
      LEFT JOIN roles r on ac.role_id = r.role_id
    WHERE ac.account_id = ?;`,
    [account_id],
    callback
  )
}

export const get_account_info_by_user_login_db = (user_login: string, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `SELECT u.*, ac.*, r.*
      FROM accounts ac 
      LEFT JOIN users u on ac.user_id = u.user_id
      LEFT JOIN roles r on ac.role_id = r.role_id
    WHERE u.user_login = ?;`,
    [user_login],
    callback
  )
}

export const delete_accounts_by_account_ids_db = (account_ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`delete from accounts where account_id in (?)`, [account_ids], callback)
}

export const get_protected_roles_db = (callback: (agr0: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from protected_roles`, callback)
}

export const set_protected_roles_db = (protected_role_ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`insert ignore into protected_roles(role_id) values (${protected_role_ids.join('),\n(')});`, callback)
}

export const remove_role_protection_db = (ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`delete from protected_roles where role_id in (?)`, [ids], callback)
}
