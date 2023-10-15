// import libraries
import {
  genSaltSync,
  hashSync,
  // , compareSync
} from 'bcrypt';
const salt = genSaltSync(10);
// import { sign } from'jsonwebtoken'
import {
  create_user_db,
  check_existing_user_ids_db,
  delete_users_by_user_ids_db,
  get_all_users_db,
  search_user_db,
  get_user_by_id_db,
  update_user_db,
  // update_user_password_db,
  get_protected_users_db,
  set_protected_users_db,
  remove_user_protection_db,
} from './users.db.service';
import {
  create_role_db,
  delete_role_by_role_ids_db,
  create_account_db,
  update_account_db,
  get_account_info_by_account_id_db,
  get_role_names_by_user_id_db,
  check_existing_role_ids_db,
  delete_accounts_by_account_ids_db,
  get_all_roles_db,
  get_role_by_role_id_db,
  get_role_by_role_name_db,
  update_role_db,
  get_protected_roles_db,
  set_protected_roles_db,
  remove_role_protection_db,
  get_account_info_by_user_login_db,
} from './roles.db.service';
import { get_sign_up_roles_db, get_account_status_enum_db } from '../aux_microservice/enum.db.service';
import moment from 'moment';
import { MysqlError } from 'mysql';
import { Request, Response } from 'express';
import { Obj } from '../../conf/types';

// encription options
// const secret_key = process.env.SECRET_KEY || 'abc123'
// const token_duration = process.env.TOKEN_DURATION || '4h'

// super user options
// const admin = process.env.ADMIN || 'admin'
// const admin_password = process.env.ADMIN_PASSWORD || 'admin'

// other busines options
const min_age: number = process.env.MIN_AGE ? parseInt(process.env.MIN_AGE) : 18;

// local reusable functions
const generate_pagitation_responce = (err: MysqlError | null, results: any, req: Request, res: Response) => {
  if (err) {
    console.log(err);
    return error_500s(500, err, res);
  }
  const results_length = results.length;
  if (results.length == 0) {
    return res.status(404).json({
      success: false,
      message: 'No records found',
    });
  }
  const body = req.body;
  const requested_page: number =
    req.headers.page && !Array.isArray(req.headers.page) ? parseInt(req.headers.page) : body.page ? parseInt(body.page) : 1;
  const requested_number_of_items_per_page: number =
    req.headers.items_per_page && !Array.isArray(req.headers.items_per_page)
      ? parseInt(req.headers.items_per_page)
      : body.items_per_page
      ? parseInt(body.items_per_page)
      : 10;
  let number_of_available_pages: number = Math.floor(results_length / requested_number_of_items_per_page);
  if (results_length % requested_number_of_items_per_page != 0) number_of_available_pages++;
  if (requested_page > number_of_available_pages) {
    return res.status(413).json({
      success: false,
      message: 'Requested page number is higher that number of available pages per given number of items per page',
      requested_number_of_items_per_page: requested_number_of_items_per_page,
      requested_page_number: requested_page,
      number_of_available_records: results_length,
      current_page: requested_page,
      total_available_pages: number_of_available_pages,
    });
  }
  const start: number = (requested_page - 1) * requested_number_of_items_per_page;
  const result: Obj[] = results.splice(start, requested_number_of_items_per_page);
  return res.status(200).json({
    success: true,
    message: 'successfull request',
    requested_number_of_items_per_page,
    requested_page_number: requested_page,
    number_of_available_records: results_length,
    current_page: requested_page,
    total_available_pages: number_of_available_pages,
    number_of_records_fetched: result.length,
    data: result,
  });
};

const success_200s = (code: number, res: Response, message: string, results?: any): Response<any, Record<string, any>> => {
  return res.status(code).json({
    success: true,
    message,
    data: results,
  });
};

const error_400s = (code: number, res: Response, message: string, data?: Obj): Response<any, Record<string, any>> => {
  return res.status(code).json({
    success: false,
    message,
    data,
  });
};

const error_500s = (code: number, err: MysqlError, res: Response): Response<any, Record<string, any>> => {
  return res.status(code).json({
    success: false,
    message: 'Internal server error',
    db_error: err.sqlMessage,
  });
};

const reusable_get_user_method = (err: MysqlError | null, results: any, res: Response, message: string): Response<any, Record<string, any>> => {
  if (err) {
    console.log(err);
    return error_500s(500, err, res);
  }
  if (!results) {
    return error_400s(404, res, 'No users data found');
  }
  return success_200s(200, res, message, results);
};
// mark
const verify_ids = (ids: any[], res: Response, callback: (arg0: number[]) => void): Response<any, Record<string, any>> | void => {
  const valid_ids: number[] = [];
  const invalid_ids: any[] = [];
  ids.forEach((each: any) => {
    if (/^\d*$/.test(String(each))) valid_ids.push(each);
    else invalid_ids.push(each);
  });
  if (invalid_ids.length > 0) return error_400s(400, res, 'ids must be digits, wrong ids: ' + invalid_ids);
  callback(valid_ids);
};

const check_user_data_for_mistakes = (body: Obj, res: Response, callback: () => void): Response<any, Record<string, any>> | void => {
  let failures: string[] = [];
  Object.keys(body).forEach((key: string) => {
    switch (key) {
      case 'first_name':
      case 'last_name':
      case 'user_login':
      case 'password':
        if (body[key].length > 20) failures.push(`'${key}' has to be no more than 20 characters`);
        break;
      case 'phone_number':
        if (body.phone_number === null || !body.phone_number.toString().match(/^([0-9]{3})[-]?([0-9]{3})[-]?([0-9]{4})$/))
          failures.push("'phone_number' has to have 10 digits or pattern of '000-000-0000'");
        break;
      case 'e_mail':
        const email_re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (body.e_mail === null || !email_re.test(String(body.e_mail).toLowerCase()))
          failures.push("'e_mail' has to be 'example@example.com' format");
        break;
      case 'dob':
        const date_re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        if (body.dob === null || !date_re.test(String(body.dob))) failures.push("'dob' has to be 'YYYY-MM-DD' format");
        const today = moment();
        const user_dob = moment(body.dob).format('YYYY-MM-DD');
        if (today.diff(user_dob, 'years') < min_age)
          failures.push(`age by given date of birth is too young, consumer has to be ${min_age} and older`);
        break;
      case 'user_id':
        if (body.user_id === null || !body.user_id.toString().match(/\d+/)) failures.push("'user_id' has to all digits");
        break;
      case 'decodedUser':
        // ignore
        break;
      default:
        failures.push(`field named '${key}' is not acceptrable!`);
    }
  });
  if (failures.length > 0) return error_400s(403, res, 'invalid fields, please fix values', failures);
  callback();
};

const check_account_data_for_mistakes = (req: Request, res: Response, callback: () => void): Response<any, Record<string, any>> | void => {
  return verify_ids([req.body.user_id, req.body.role_id], res, () => {
    // TO DO implement account_status_enum
    return get_account_status_enum_db((err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (results.length === 0) {
        return error_400s(404, res, 'No account status data found in account_status_enum table, please contact system administrator.');
      }
      const existing_account_statuses: string[] = [];
      results.forEach((each_row: Obj) => {
        existing_account_statuses.push(each_row.account_status);
      });
      if (!existing_account_statuses.includes(req.body.account_status))
        return error_400s(400, res, 'invalid account_status. Accepted values : ' + existing_account_statuses);
      if (req.body.termination_date === null) return callback();
      const date_re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
      if (!date_re.test(String(req.body.termination_date)))
        return error_400s(400, res, "invalid termination_date,if provided has to be 'YYYY-MM-DD' format, or null");
      if (moment().isAfter(moment(req.body.termination_date).format('YYYY-MM-DD')))
        return error_400s(403, res, "it's not allowed to terminate account retroactively");
      return callback();
    });
  });
};

const check_for_protected_user_ids = (user_ids: number[], res: Response, callback: () => void): Response<any, Record<string, any>> | void => {
  return get_protected_users_db((err: MysqlError | null, results: any): Response<any, Record<string, any>> | void => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    let protected_user_ids: number[] = [];
    results.forEach((each: Obj) => protected_user_ids.push(each.user_id));
    const found_protected_user_ids: number[] = [];
    user_ids.forEach((user_id: number) => {
      if (protected_user_ids.includes(user_id)) found_protected_user_ids.push(user_id);
    });
    if (found_protected_user_ids.length > 0)
      return error_400s(403, res, `user_ids: ${found_protected_user_ids} are used by system and protected from modifications and deletions`);
    callback();
  });
};

const check_for_protected_role_ids = (role_ids: number[], res: Response, callback: () => void): Response<any, Record<string, any>> | void => {
  get_protected_roles_db((err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    const protected_role_ids: number[] = [];
    results.forEach((each: Obj) => protected_role_ids.push(each.role_id));
    const found_protected_role_ids: number[] = [];
    role_ids.forEach((role_id: number) => {
      if (protected_role_ids.includes(role_id)) found_protected_role_ids.push(role_id);
    });
    if (found_protected_role_ids.length > 0)
      return error_400s(403, res, `role ids: ${found_protected_role_ids} are used by system and protected from modifications and deletions`);
    return callback();
  });
};

const normalize_phone_number = (initial_value: string) => {
  return initial_value.replace(/-/g, '');
};

// controllers

export const create_user = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  return check_user_data_for_mistakes(req.body, res, () => {
    req.body.password = hashSync(req.body.password, salt);
    req.body.phone_number = normalize_phone_number(req.body.phone_number);
    return create_user_db(req.body, (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        if (err.code == 'ER_DUP_ENTRY') {
          return error_400s(409, res, err.message);
        }
        return error_500s(500, err, res);
      }
      return success_200s(201, res, 'Successfully created new user', {
        user_id: results.insertId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        dob: req.body.dob,
        account_login: req.body.account_login,
        e_mail: req.body.e_mail,
        phone_number: req.body.phone_number,
      });
    });
  });
};

export const get_all_users = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  get_all_users_db((err: MysqlError | null, results: any) => {
    generate_pagitation_responce(err, results, req, res);
  });
};

export const get_user_by_id = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  verify_ids([req.params.id], res, (ids: number[]) => {
    get_user_by_id_db(ids[0], (err: MysqlError | null, results: any) => {
      reusable_get_user_method(err, results, res, 'Found user by provided user_id');
    });
  });
};

export const search_for_user = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  const acceptable_search_keys: string[] = ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'];
  let acceptable_keys_not_found: boolean = true;
  let all_of_acceptable_keys_are_blank: boolean = true;
  let not_acceptable_query_parameters: string[] = [];
  Object.keys(req.query).forEach((key: string) => {
    if (acceptable_search_keys.includes(key)) {
      acceptable_keys_not_found = false;
      const value = req.query[key];
      if (all_of_acceptable_keys_are_blank) {
        if (value !== '' && value !== '*') {
          all_of_acceptable_keys_are_blank = false;
        }
      }
    } else not_acceptable_query_parameters.push(key);
  });
  if (acceptable_keys_not_found || not_acceptable_query_parameters.length > 0 || all_of_acceptable_keys_are_blank) {
    let responce_json: Obj = {
      available_query_parameters: ['user_id', 'user_login', 'e_mail', 'phone_number', 'first_name', 'last_name'],
    };
    if (not_acceptable_query_parameters.length > 0) responce_json.not_acceptable_query_parameters = not_acceptable_query_parameters;
    if (!acceptable_keys_not_found && all_of_acceptable_keys_are_blank)
      responce_json.invalid_values = 'all query parameters are empty or *, at least one has to have value';
    return error_400s(403, res, 'invalid querry parameter', responce_json);
  }
  search_user_db(req.query, (err: MysqlError | null, results: any) => {
    generate_pagitation_responce(err, results, req, res);
  });
};

export const update_user = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (req.body.password)
    return error_400s(403, res, "Password update is prohibited! User has to change password himself by 'Forogot Password' procedure!");
  check_user_data_for_mistakes(req.body, res, (): Response<any, Record<string, any>> | void => {
    if (!req.body.user_id || Object.keys(req.body).length === 1)
      return error_400s(403, res, 'invalid fields, at least one optional field has to be present', {
        required_field: 'user_id',
        optional_fields: ['first_name', 'last_name', 'dob', 'user_login', 'e_mail', 'phone_number'],
        restricted_field: 'password',
      });
    check_for_protected_user_ids([req.body.user_id], res, () => {
      if (req.body.phone_number) req.body.phone_number = normalize_phone_number(req.body.phone_number);
      return update_user_db(req.body, (err1: MysqlError | null, results1: any) => {
        if (err1) {
          console.log(err1);
          if (err1.code == 'ER_DUP_ENTRY') {
            return error_400s(409, res, err1.message);
          }
          return error_500s(500, err1, res);
        }
        if (results1.affectedRows === 0) return error_400s(404, res, 'No users found by user_id ' + req.body.user_id);
        return get_user_by_id_db(req.body.user_id, (err2: MysqlError | null, results2: any) => {
          if (err2) console.log(err2);
          return success_200s(201, res, 'Successfully updated user', results2);
        });
      });
    });
  });
};

export const delete_users_by_user_ids = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (!req.body.user_ids) return error_400s(400, res, 'no user_ids for deletion provided in body');
  verify_ids(req.body.user_ids, res, (user_ids_to_delete: number[]) => {
    check_for_protected_user_ids(user_ids_to_delete, res, () => {
      check_existing_user_ids_db(user_ids_to_delete, (_err1: MysqlError | null, results1: any): Response<any, Record<string, any>> | void => {
        const existing_user_ids: number[] = results1.reduce((ids: number[], row: Obj) => {
          ids.push(row.user_id);
          return ids;
        }, []);
        const non_existing_user_ids: number[] = user_ids_to_delete.filter((id: number) => {
          return !existing_user_ids.includes(id);
        });
        if (existing_user_ids.length === 0) return error_400s(404, res, 'no data was found to delet by user ids: ' + user_ids_to_delete);
        delete_users_by_user_ids_db(existing_user_ids, (err2: MysqlError | null, results2: any): Response<any, Record<string, any>> | void => {
          if (err2) {
            console.log(err2);
            return error_500s(500, err2, res);
          }
          if (results2.affectedRows !== 0)
            return success_200s(200, res, 'successfully deleted user by ids: ' + existing_user_ids, {
              affectedRows: results2.affectedRows,
              non_existing_user_ids,
            });
        });
      });
    });
  });
};

export const get_protected_users = (_req: Request, res: Response): Response<any, Record<string, any>> | void => {
  get_protected_users_db((err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    const protected_user_ids: number[] = [];
    results.forEach((each: Obj) => {
      protected_user_ids.push(each.user_id);
    });
    return success_200s(200, res, 'successfully fetched protected users', {
      protected_user_ids,
    });
  });
};

export const set_protected_users = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  verify_ids(req.body.user_ids, res, (user_ids: number[]) => {
    set_protected_users_db(user_ids, (err: MysqlError | null, _results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      return success_200s(201, res, 'Successfully set protected users', {
        protected_user_ids: user_ids,
      });
    });
  });
};

export const remove_user_protection = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (!req.body.user_ids) return error_400s(400, res, 'no user_ids provided in body for removing user protection');
  verify_ids(req.body.user_ids, res, (user_ids: number[]) => {
    remove_user_protection_db(user_ids, (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      return success_200s(200, res, `user_ids: ${user_ids} are no longer protected`, {
        affectedRows: results.affectedRows,
      });
    });
  });
};

export const create_role = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  create_role_db(req.body, (err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err);
      if (err.code == 'ER_DUP_ENTRY') {
        return error_400s(409, res, err.message);
      }
      return error_500s(500, err, res);
    }
    return success_200s(201, res, 'Successfully created new role', {
      role_id: results.insertId,
      role_name: req.body.role_name,
      can_read_role: req.body.can_read_role,
      can_create_role: req.body.can_create_role,
      can_modify_role: req.body.can_modify_role,
      can_delete_role: req.body.can_delete_role,
      can_read_order: req.body.can_read_order,
      can_create_order: req.body.can_create_order,
      can_modify_order: req.body.can_modify_order,
      can_delete_order: req.body.can_delete_order,
      can_read_user: req.body.can_read_user,
      can_create_user: req.body.can_create_user,
      can_modify_user: req.body.can_modify_user,
      can_delete_user: req.body.can_delete_user,
      can_read_book: req.body.can_read_book,
      can_create_book: req.body.can_create_book,
      can_modify_book: req.body.can_modify_book,
      can_delete_book: req.body.can_delete_book,
      can_read_events: req.body.can_read_events,
    });
  });
};

export const get_all_roles = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  get_all_roles_db((err: MysqlError | null, results: any) => {
    generate_pagitation_responce(err, results, req, res);
  });
};

export const get_role_by_role_id = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  verify_ids([req.params.id], res, (ids: number[]) => {
    get_role_by_role_id_db(ids[0], (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (!results) {
        return error_400s(404, res, `No role data found by role_id '${ids[0]}'`);
      }
      return success_200s(200, res, 'successfully found role', results);
    });
  });
};

export const get_role_by_role_name = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (!req.body.role_name) return error_400s(400, res, 'no role_name provided in body');
  get_role_by_role_name_db(req.body.role_name, (err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    if (!results) {
      return error_400s(404, res, 'No role data found by role_name ' + req.body.role_name);
    }
    return success_200s(200, res, 'successfully found role', results);
  });
};

export const update_role = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  check_for_protected_role_ids([req.body.role_id], res, () => {
    update_role_db(req.body, (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        if (err.code == 'ER_DUP_ENTRY') {
          return error_400s(409, res, err.message);
        }
        return error_500s(500, err, res);
      }
      if (results.affectedRows === 0) return error_400s(404, res, 'No roles found by role_id ' + req.body.role_id);
      return success_200s(201, res, 'Successfully updated role', {
        role_id: req.body.role_id,
        role_name: req.body.role_name,
        can_read_role: req.body.can_read_role,
        can_create_role: req.body.can_create_role,
        can_modify_role: req.body.can_modify_role,
        can_delete_role: req.body.can_delete_role,
        can_read_order: req.body.can_read_order,
        can_create_order: req.body.can_create_order,
        can_modify_order: req.body.can_modify_order,
        can_delete_order: req.body.can_delete_order,
        can_read_user: req.body.can_read_user,
        can_create_user: req.body.can_create_user,
        can_modify_user: req.body.can_modify_user,
        can_delete_user: req.body.can_delete_user,
        can_read_book: req.body.can_read_book,
        can_create_book: req.body.can_create_book,
        can_modify_book: req.body.can_modify_book,
        can_delete_book: req.body.can_delete_book,
        can_read_events: req.body.can_read_events,
      });
    });
  });
};

export const delete_roles_by_role_ids = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (!req.body.role_ids) return error_400s(400, res, 'no role_ids for deletion provided in body');
  return verify_ids(req.body.role_ids, res, (role_ids_to_delete: number[]) => {
    return check_for_protected_role_ids(role_ids_to_delete, res, () => {
      return check_existing_role_ids_db(role_ids_to_delete, (err1: MysqlError | null, results1: any): Response<any, Record<string, any>> | void => {
        if (err1) {
          console.log(err1);
          return error_500s(500, err1, res);
        }
        const existing_role_ids: number[] = results1.reduce((ids: number[], row: Obj) => {
          ids.push(row.user_id);
          return ids;
        }, []);
        const non_existing_role_ids: number[] = role_ids_to_delete.filter((id: number) => {
          return !existing_role_ids.includes(id);
        });
        if (existing_role_ids.length === 0) return error_400s(404, res, `no data was found to delet by role ids: '${role_ids_to_delete}'`);
        delete_role_by_role_ids_db(existing_role_ids, (err2: MysqlError | null, results2: any): Response<any, Record<string, any>> | void => {
          if (err2) {
            console.log(err2);
            return error_500s(500, err2, res);
          }
          if (results2.affectedRows !== 0)
            return success_200s(200, res, `successfully deleted roles by ids: '${existing_role_ids}'`, {
              affectedRows: results2.affectedRows,
              non_existing_role_ids,
            });
        });
      });
    });
  });
};

export const get_protected_roles = (_req: Request, res: Response): Response<any, Record<string, any>> | void => {
  get_protected_roles_db((err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    if (results.length == 0) {
      return res.status(404).json({
        success: false,
        message: 'No records found',
        db_responce: results,
      });
    }
    let protected_role_ids: number[] = [];
    results.map((each: Obj) => {
      protected_role_ids.push(each.role_id);
    });
    return success_200s(200, res, 'successfully fetched protected roles', {
      protected_role_ids: protected_role_ids,
    });
  });
};

export const set_protected_roles = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  verify_ids(req.body.role_ids, res, (role_ids: number[]) => {
    set_protected_roles_db(role_ids, (err: MysqlError | null, _results: any) => {
      if (err) {
        console.log(err);
        if (err.code == 'ER_DUP_ENTRY') {
          return error_400s(409, res, err.message);
        }
        return error_500s(500, err, res);
      }
      return success_200s(201, res, 'Successfully set protected roles', {
        protected_role_ids: role_ids,
      });
    });
  });
};

export const remove_role_protection = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (!req.body.role_ids) return error_400s(400, res, 'no role_ids provided in body for removing role protection');
  verify_ids(req.body.role_ids, res, (role_ids: number[]) => {
    remove_role_protection_db(role_ids, (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (results.affectedRows == 0) return error_400s(404, res, `no data was found by role_ids: '${req.body.role_ids}'`);
      return success_200s(200, res, `successfully removed protections for role_ids: '${req.body.role_ids}'`, {
        affectedRows: results.affectedRows,
      });
    });
  });
};

export const create_account = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  check_account_data_for_mistakes(req, res, () => {
    // 1
    get_role_names_by_user_id_db(req.body.user_id, (error1: MysqlError | null, results1: any) => {
      if (error1) {
        console.log(error1);
        return error_500s(500, error1, res);
      }
      const found_duplicates: Obj[] = [];
      results1.forEach((role: Obj) => {
        if (role.role_id == req.body.role_id) found_duplicates.push(role);
      });
      if (found_duplicates.length > 0) {
        let duplicates: Obj[] = [];
        found_duplicates.forEach((duplicate) => {
          duplicates.push({
            account_id: duplicate.account_id,
            user_id: req.body.user_id,
            role_id: duplicate.role_id,
            role_name: duplicate.role_name,
            account_status: duplicate.account_status,
            termination_date: duplicate.termination_date,
          });
        });
        return error_400s(403, res, 'account already exists', {
          duplicates,
        });
      }
      // 2
      return create_account_db(req.body, (error2: MysqlError | null, results2: any) => {
        if (error2) {
          console.log(error2);
          return error_500s(500, error2, res);
        }
        return success_200s(201, res, 'Successfully created account', {
          account_id: results2.insertId,
          user_id: req.body.user_id,
          role_id: req.body.role_id,
          account_status: req.body.account_status,
          termination_date: req.body.termination_date,
        });
      });
    });
  });
};

export const update_account = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  check_account_data_for_mistakes(req, res, () => {
    // 1
    get_role_names_by_user_id_db(req.body.user_id, (error1: MysqlError | null, results1: any): Response<any, Record<string, any>> | void => {
      if (error1) {
        console.log(error1);
        return error_500s(500, error1, res);
      }
      const found_duplicates: Obj[] = [];
      results1.forEach((role: Obj) => {
        if (role.role_id == req.body.role_id) found_duplicates.push(role);
      });
      if (found_duplicates.length > 0) {
        let duplicates: Obj[] = [];
        found_duplicates.forEach((duplicate) => {
          duplicates.push({
            account_id: duplicate.account_id,
            user_id: req.body.user_id,
            role_id: duplicate.role_id,
            role_name: duplicate.role_name,
            account_status: duplicate.account_status,
            termination_date: duplicate.termination_date,
          });
        });
        return error_400s(403, res, 'account already exists', {
          duplicates,
        });
      }
      // 2
      update_account_db(req.body, (error2: MysqlError | null, _results2: any) => {
        if (error2) {
          console.log(error2);
          return error_500s(500, error2, res);
        }
        return success_200s(201, res, 'Successfully updated account', {
          account_id: req.body.account_id,
          account_status: req.body.account_status,
          termination_date: req.body.termination_date,
        });
      });
    });
  });
};

export const get_account_info_by_account_id = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  verify_ids([req.params.id], res, (ids: number[]) => {
    get_account_info_by_account_id_db(ids[0], (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (!results) {
        return error_400s(404, res, `No account data found by account_id '${ids[0]}'`);
      }
      return success_200s(200, res, 'successfully found account', results);
    });
  });
};

export const get_account_info_by_user_login = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  get_account_info_by_user_login_db(req.body.user_login, (err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    if (!results) {
      return error_400s(404, res, `No account data found by user_login '${req.body.user_login}'`);
    }
    return success_200s(200, res, 'successfully found accounts', results);
  });
};

export const get_role_names_by_user_id = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  verify_ids([req.params.id], res, (ids: number[]) => {
    get_role_names_by_user_id_db(ids[0], (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (!results) {
        return error_400s(404, res, `No roles data found by user_id '${ids[0]}'`);
      }
      return success_200s(200, res, 'successfully found roles', results);
    });
  });
};

export const delete_accounts_by_account_ids = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  if (!req.body.account_ids) return error_400s(400, res, 'account_ids not provided, please provide account_ids as array');
  verify_ids(req.body.account_ids, res, (account_ids_to_delete: number[]) => {
    delete_accounts_by_account_ids_db(account_ids_to_delete, (err: MysqlError | null, results: any) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (results.affectedRows == 0) return error_400s(404, res, `no data was found to delet by account_ids: '${account_ids_to_delete}'`);
      return success_200s(201, res, `successfully deleted accounts by account_ids: '${account_ids_to_delete}'`, {
        affectedRows: results.affectedRows,
      });
    });
  });
};

export const student_employee_sign_up = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  // 1
  get_sign_up_roles_db((error1: MysqlError | null, results1: any): Response<any, Record<string, any>> | void => {
    if (error1) {
      console.log(error1);
      return error_500s(500, error1, res);
    }
    if (results1.length == 0) {
      return error_400s(404, res, 'No sign up roles found, please report to system administrator');
    }
    const allowed_sign_up_roles: string[] = [];
    results1.forEach((each: Obj) => {
      allowed_sign_up_roles.push(each.role_name);
    });
    if (!allowed_sign_up_roles.includes(req.body.role_name))
      return error_400s(401, res, `provided role '${req.body.role_name}' is not allowed as sign up role`, {
        allowed_sign_up_roles: allowed_sign_up_roles,
      });
    // 2
    get_role_by_role_name_db(req.body.role_name, (error2: MysqlError | null, results2: any): Response<any, Record<string, any>> | void => {
      if (error2) {
        console.log(error2);
        return error_500s(500, error2, res);
      }
      if (!results2) {
        return error_400s(404, res, `No role data found by role_name '${req.body.role_name}'`);
      }
      req.body.role_id = results2.role_id;
      // 3
      check_user_data_for_mistakes(req, res, () => {
        check_account_data_for_mistakes(req, res, () => {
          req.body.password = hashSync(req.body.password, salt);
          create_user_db(req.body, (error3: MysqlError | null, results3: any): Response<any, Record<string, any>> | void => {
            if (error3) {
              console.log(error3);
              if (error3.code == 'ER_DUP_ENTRY') {
                return error_400s(409, res, error3.message);
              }
              return error_500s(500, error3, res);
            }
            req.body.user_id = results3.insertId;
            // 4
            create_account_db(req.body, (error4: MysqlError | null, results4: any) => {
              if (error4) {
                console.log(error4);
                return error_500s(500, error4, res);
              }
              return success_200s(201, res, `Successfully signed up as '${req.body.role_name}'`, {
                account_id: results4.insertId,
                user_id: req.body.user_id,
                role_id: req.body.role_id,
                account_status: req.body.account_status,
                termination_date: req.body.termination_date,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                dob: req.body.dob,
                account_login: req.body.account_login,
                e_mail: req.body.e_mail,
                phone_number: req.body.phone_number,
              });
            });
          });
        });
      });
    });
  });
};
