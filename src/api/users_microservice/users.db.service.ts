import { MysqlError } from 'mysql'
import { Obj, User } from '../../conf/types'
import { pool } from '../database/mysql'

export const create_user_db = (data: User, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `insert into users (first_name, last_name, dob, user_login, password, e_mail, phone_number)
        values(?,?,?,?,?,?,?)`,
    [data.first_name, data.last_name, data.dob, data.user_login, data.password, data.e_mail, data.phone_number],
    callback
  )
}

export const get_all_users_db = (callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users`, callback)
}

export const get_user_by_id_db = (id: number, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users
        where user_id = ?`,
    [id],
    callback
  )
}

export const get_user_by_login_db = (user_login: string, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(
    `select user_id, first_name, last_name, dob, user_login, password, e_mail, phone_number from users
        where user_login = ?`,
    [user_login],
    callback
  )
}

export const search_user_db = (data: Obj, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  let search_parameters = ''
  Object.keys(data).forEach((key) => {
    if (data[key] && data[key] !== '*' && data[key] !== '') {
      if (search_parameters === '') search_parameters = `where ${key} = '${data[key]}'`
      else search_parameters = search_parameters + `\n\tand ${key} = '${data[key]}'`
    }
  })
  pool.query(
    `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number
      from users
      ${search_parameters}`,
    callback
  )
}

export const update_user_db = (data: Obj, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  let columns_to_update = Object.keys(data).reduce((result, key) => {
    if (key !== 'user_id') result = result + `, ${key} = '${data[key]}'`
    return result
  }, '')
  columns_to_update = columns_to_update.substring(2)
  pool.query(
    `update users set ${columns_to_update}
        where user_id = ?`,
    [data.user_id],
    callback
  )
}

export const update_user_password_db = (data: Obj, callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`update users set password = ? where user_id = ?`, [data.password, data.user_id], callback)
}

export const check_existing_user_ids_db = (ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select user_id from users where user_id in (?)`, [ids], callback)
}

export const delete_users_by_user_ids_db = (ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`delete from users where user_id in (?)`, [ids], callback)
}

export const get_protected_users_db = (callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`select * from protected_users`, callback)
}

export const set_protected_users_db = (protected_user_ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`insert ignore into protected_users(user_id) values (${protected_user_ids.join('),\n(')});`, callback)
}

export const remove_user_protection_db = (ids: number[], callback: (db_error: MysqlError | null, db_result: any) => void): void => {
  pool.query(`delete ignore from protected_users where user_id in (?)`, [ids], callback)
}
