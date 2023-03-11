// import libraries
import { pool } from '../database/mysql'
import { genSaltSync, hashSync } from 'bcrypt'
import { create_user_db, set_protected_users_db } from '../users_microservice/users.db.service'
import { create_account_db, create_role_db, get_role_by_role_name_db, set_protected_roles_db } from '../users_microservice/roles.db.service'
import { save_to_sign_up_roles_db, save_to_account_status_enum_db } from '../aux_microservice/enum.db.service'

const salt = genSaltSync(10)

const table_schema = process.env.MYSQL_DATABASE || 'library_db'
import { table_structure } from './table_structure'
const admin = process.env.ADMIN || 'admin'
const admin_password = process.env.ADMIN_PASSWORD || 'admin'
import { system_roles, account_statuses, sign_up_roles } from './conf'
import { MysqlError } from 'mysql'
import { Role, User } from '../../conf/types'

const table_exist = async (name: string): Promise<boolean> => {
  console.log(`Checking if table ${name} exists`)
  return new Promise<boolean>((resolve) => {
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
          resolve(false)
        } else {
          console.log(`Table ${name} exist`)
          resolve(true)
        }
      }
    )
  })
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

const test_table_structure = async (): Promise<void> => {
  for await (const table of table_structure) {
    if (!(await table_exist(table.name))) await create_table(table.name, table.query)
  }
}

const user_exist = async (user_login: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    pool.query(
      `select exists(
        select 1 from users
        where user_login = ?
      ) as 'exist';`,
      [user_login],
      (error: MysqlError | null, results: any): void => {
        if (error) throw new Error(error.message)
        resolve(results[0].exist === 1)
      }
    )
  })
}

const test_super_user_exist = async (): Promise<void> => {
  console.log('Checking if super user exists . . .')
  if (!(await user_exist(admin))) {
    console.log("Super user doesn't exist, creating . . .")
    const admin_hash_password = hashSync(admin_password, salt)
    const data: User = {
      first_name: 'Enabler',
      last_name: 'Account',
      dob: '2022-03-17',
      user_login: admin,
      password: admin_hash_password,
      e_mail: 'admin@library.com',
      phone_number: 1234567890,
    }
    const admin_id: number = await new Promise<number>((resolve) => {
      create_user_db(data, (error: MysqlError | null, results: any) => {
        if (error) console.log('Failed to create Super user!\n' + error.message)
        if (results) {
          if (typeof results.insertId === 'number') {
            console.log(`Successfully created super admin! admin id is '${results.insertId}'`)
            resolve(results.insertId)
          } else resolve(-1)
        }
      })
    })
    if (admin_id !== -1) {
      await new Promise<void>((resolve) => {
        set_protected_users_db([admin_id], (error: MysqlError | null, results: any) => {
          if (error) console.log('Failed to set protection for Super user!\n' + error.message)
          if (results) {
            console.log('Successfully set protection for super admin!')
          }
          resolve()
        })
      })
      const admin_role_id: number = await new Promise<number>((resolve) => {
        get_role_by_role_name_db('admin', (error: MysqlError | null, results: any) => {
          console.log(results)
          if (error) console.log('Failed to set protection for Super user!\n' + error.message)
          if (typeof results[0].role_id === 'number') resolve(results[0].role_id)
          else resolve(-1)
        })
      })
      if (admin_role_id !== -1)
        await new Promise<void>((resolve) => {
          create_account_db(
            {
              user_id: admin_id,
              role_id: admin_role_id,
              account_status: 'active',
              termination_date: null,
            },
            (error: MysqlError | null, results: any) => {
              if (error) console.log('Failed to Super user account!\n' + error.message)
              if (typeof results.insertId === 'number')
                console.log(`Successfully created super admin account! admin account id is '${results.insertId}'`)
              else console.log(`Failed to created super admin account!`)
              resolve()
            }
          )
        })
    }
  } else console.log('Super user exist!')
}

const save_system_roles = async (system_roles: Role[]): Promise<void> => {
  for await (const system_role of system_roles) {
    await new Promise<void>((resolve) => {
      create_role_db(system_role, (error1: MysqlError | null, results1: any): void => {
        if (error1) console.log(`Failed to create '${system_role.role_name}' role!\n'${error1.message}`)
        if (results1.insertId) {
          console.log(`Successfully created '${system_role.role_name}' role!`)
          set_protected_roles_db([results1.insertId], (error2: MysqlError | null, results2: any) => {
            if (error2) console.log(`Failed to set protection for '${system_role.role_name}' role!\n${error2.message}`)
            if (results2) {
              console.log(`Successfully set protection for '${system_role.role_name}' role!`)
              resolve()
            }
          })
        } else resolve()
      })
    })
  }
}

const test_system_roles_exist = async (): Promise<void> => {
  // 1
  const existing_system_role_names: string[] = []
  const absent_system_roles: Role[] = []
  for await (const system_role of system_roles) {
    await new Promise<void>((resolve) => {
      pool.query(
        `select exists(
        select 1 from roles
        where role_name = ?
      ) as 'exist';`,
        [system_role.role_name],
        (error1: MysqlError | null, results1: any): void => {
          if (error1) console.log(error1)
          if (results1[0].exist === 1) existing_system_role_names.push(system_role.role_name)
          else absent_system_roles.push(system_role)
          resolve()
        }
      )
    })
  }
  // 2
  if (existing_system_role_names.length) console.log(`system roles [${existing_system_role_names}] exist`)
  if (absent_system_roles.length) await save_system_roles(absent_system_roles)
}

const test_sign_up_roles_exist = async (): Promise<void> => {
  // 1
  console.log('checking if sign up roles exist . . .')
  const absent_sign_up_roles: string[] = []
  const existing_sign_up_roles: string[] = []
  for await (const sign_up_role of sign_up_roles) {
    await new Promise<void>((resolve) => {
      pool.query(
        `select exists(
        select 1 from sign_up_roles
        where role_name = ?
      ) as 'exist';`,
        [sign_up_role],
        (error1: MysqlError | null, results1: any): void => {
          if (error1) console.log(error1)
          if (results1[0].exist === 1) existing_sign_up_roles.push(sign_up_role)
          else absent_sign_up_roles.push(sign_up_role)
          resolve()
        }
      )
    })
  }
  // 2
  if (existing_sign_up_roles.length) console.log(`sign up roles [${existing_sign_up_roles}] exist`)
  if (absent_sign_up_roles.length)
    await new Promise<void>((resolve) => {
      save_to_sign_up_roles_db(absent_sign_up_roles, (error2, results2) => {
        if (error2) console.log(`Failed to save sign up roles [${absent_sign_up_roles}] !\n'${error2.message}'`)
        if (results2) console.log(`Successfully saved sign up roles [${absent_sign_up_roles}]!`)
        resolve()
      })
    })
}

const test_account_status_enums_exist = async (): Promise<void> => {
  const absent_account_statuses: string[] = []
  const existing_account_statuses: string[] = []
  // 1
  console.log('checking if account status enum table hase account statuses . . .')
  for await (const account_status of account_statuses) {
    await new Promise<void>((resolve) => {
      pool.query(
        `select exists(
          select 1 from account_status_enum
          where account_status = ?
        ) as 'exist';`,
        [account_status],
        (error1: MysqlError | null, results1: any): void => {
          if (error1) console.log(error1.sqlMessage)
          if (results1[0].exist === 1) existing_account_statuses.push(account_status)
          else absent_account_statuses.push(account_status)
          resolve()
        }
      )
    })
  }
  // 2
  if (existing_account_statuses.length) console.log(`account statuses [${existing_account_statuses}] exist`)
  if (absent_account_statuses.length)
    await new Promise<void>((resolve) => {
      return save_to_account_status_enum_db(absent_account_statuses, (error2: MysqlError | null, results2: any) => {
        if (error2) console.log(`Failed to save account statuses [${absent_account_statuses}] !\n'${error2.message}'`)
        if (results2) console.log(`Successfully saved account statuses [${absent_account_statuses}] !`)
        resolve()
      })
    })
}

export const deploy_database = async (): Promise<void> => {
  await test_table_structure()
  await test_system_roles_exist()
  await test_sign_up_roles_exist()
  await test_super_user_exist()
  return test_account_status_enums_exist()
}
