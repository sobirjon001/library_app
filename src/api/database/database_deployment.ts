// import libraries
import { pool } from '../database/mysql'
import { genSaltSync, hashSync } from 'bcrypt'
import { create_user, set_protected_users } from '../users_microservice/users.db.service'
import { create_role, set_protected_roles } from '../users_microservice/roles.db.service'
import { save_to_sign_up_roles, save_to_account_status_enum } from '../aux_microservice/enum.db.service'

const salt = genSaltSync(10)

const table_schema = process.env.MYSQL_DATABASE || 'library_db'
import { table_structure } from './table_structure'
const admin = process.env.ADMIN || 'admin'
const admin_password = process.env.ADMIN_PASSWORD || 'admin'
import { system_roles, account_statuses, sign_up_roles } from './conf'
import { MysqlError } from 'mysql'
import { Role } from '../../conf/types'

const table_exist = (name: string, callback: (arg0: boolean) => void): void => {
  console.log(`Checking if table ${name} exists`)
  pool.query(
    `select exists(
        select 1 from information_schema.tables
        where table_schema = '${table_schema}'
        and table_name = '${name}'
      ) as 'exist';`,
    [],
    (err: MysqlError | null, results: any) => {
      if (err) console.log(err)
      if (results[0].exist === 0) {
        console.log(`Table ${name} does't exist`)
        return callback(false)
      } else {
        console.log(`Table ${name} exist`)
        return callback(true)
      }
    }
  )
}

const create_table = (name: string, query: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    console.log(`Creating table ${name} . . .`)
    pool.query(`${query}`, [], (err) => {
      if (err) console.log(err)
      resolve()
    })
  })
}

const test_table_structure = (i: number, next: () => void): void => {
  if (i === table_structure.length) return next()
  table_exist(table_structure[i].name, async (exist) => {
    if (!exist) await create_table(table_structure[i].name, table_structure[i].query)
    return test_table_structure(++i, next)
  })
}

const test_super_user_exist = (next: () => void): void => {
  console.log('Checking if super user exists . . .')
  pool.query(
    `select exists(
      select 1 from users
      where user_login = ?
    ) as 'exist';`,
    [admin],
    (error: MysqlError | null, results: any): void => {
      if (error) throw new Error(error.sqlMessage)
      if (results[0].exist === 0) {
        console.log("Super user doesn't exist, creating . . .")
        const admin_hash_password = hashSync(admin_password, salt)
        const data = {
          first_name: 'Enabler',
          last_name: 'Account',
          dob: '2022-03-17',
          user_login: admin,
          password: admin_hash_password,
          e_mail: 'admin@library.com',
          phone_number: 1234567890,
        }
        // mark
        return create_user(data, (error1, results1) => {
          if (error1) console.log('Failed to create Super user!\n' + error1.message)
          if (results1) {
            console.log('Successfully created super admin!')
            return set_protected_users([results1.insertId], (error2, results2) => {
              if (error2) console.log('Failed to set protection for Super user!\n' + error2.message)
              if (results2) {
                console.log('Successfully set protection for super admin!')
                return next()
              }
            })
          }
        })
      } else {
        console.log('Super user exists, please login as ' + admin)
        return next()
      }
    }
  )
}

const save_system_role = (i: number, system_roles: Role[], next: () => void): void => {
  if (i === system_roles.length) return next()
  // mark
  return create_role(system_roles[i], (error1: MysqlError | null, results1: any): void => {
    if (error1) console.log(`Failed to create '${system_roles[i].role_name}' role!\n'${error1.message}`)
    if (results1) {
      console.log(`Successfully created '${system_roles[i].role_name}' role!`)
      return set_protected_roles([results1.insertId], (error2, results2) => {
        if (error2) console.log('Failed to set protection for ' + system_roles[i].role_name + ' role!\n' + error2.message)
        if (results2) {
          console.log('Successfully set protection for ' + system_roles[i].role_name + ' role!')
          return save_system_role(++i, system_roles, next)
        }
      })
    }
  })
}

const test_system_roles_exist = (next: () => void): void => {
  // 1
  pool.query(`select role_name from roles`, [], (error1: MysqlError | null, results1: any): void => {
    if (error1) console.log(error1)
    const existing_system_role_names: string[] = []
    const absent_system_roles: Role[] = []
    system_roles.forEach((role: Role) => {
      if (results1.includes(role.role_name)) existing_system_role_names.push(role.role_name)
      else absent_system_roles.push(role)
    })
    if (existing_system_role_names.length) console.log(`system roles ${existing_system_role_names} exist`)
    // 2
    return save_system_role(0, absent_system_roles, next)
  })
}

const test_sign_up_roles_exist = (next: () => void): void => {
  // 1
  pool.query(`select sign_up_roles from sign_up_roles`, (error1: MysqlError | null, results1: any): void => {
    if (error1) console.log(error1)
    const absent_sign_up_roles: string[] = []
    const existing_sign_up_roles: string[] = []
    sign_up_roles.forEach((sign_up_role: string): void => {
      if (results1.includes(sign_up_role)) existing_sign_up_roles.push(sign_up_role)
      else absent_sign_up_roles.push(sign_up_role)
    })
    if (existing_sign_up_roles.length) console.log(`sign up roles ${existing_sign_up_roles} exist`)
    // 2
    // mark
    return save_to_sign_up_roles(abcent_sign_up_roles, (error2, results2) => {
      if (error2) console.log('Failed to save sign up roles [' + abcent_sign_up_roles + '] !\n' + error2.message)
      if (results2) console.log('Successfully saved sign up roles [' + abcent_sign_up_roles + '] !')
      return next()
    })
  })
}

const test_account_status_enums_exist = (next: () => void): void => {
  // 1
  console.log('checking if account status enum table hase account statuses . . .')
  pool.query(`select * from account_status_enum`, (error1: MysqlError | null, results1: any): void => {
    if (error1) throw new Error(error1.sqlMessage)
    const absent_account_statuses: string[] = []
    const existing_account_statuses: string[] = []
    account_statuses.forEach((account_status: string): void => {
      if (results1.includes(account_status)) existing_account_statuses.push(account_status)
      else absent_account_statuses.push(account_status)
    })
    if (existing_account_statuses.length) console.log(`account statuses ${existing_account_statuses} exist`)
    // 2
    // mark
    return save_to_account_status_enum(abcent_account_statuses, (error2, results2) => {
      if (error2) console.log('Failed to save account statuses [' + abcent_account_statuses + '] !\n' + error2.message)
      if (results2) console.log('Successfully saved account status [' + abcent_account_statuses + '] !')
      return next()
    })
  })
}

export const database_deployment = (next: () => void): void => {
  return test_table_structure(0, () => {
    return test_super_user_exist(() => {
      return test_system_roles_exist(() => {
        return test_sign_up_roles_exist(() => {
          return test_account_status_enums_exist(next)
        })
      })
    })
  })
}
