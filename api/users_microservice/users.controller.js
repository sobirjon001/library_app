// import libraries
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const salt = genSaltSync(10);
const { sign } = require("jsonwebtoken");
const {
  create_user,
  delete_users_by_user_ids,
  get_all_users,
  search_user,
  get_user_by_id,
  update_user,
  update_user_password,
  get_protected_users,
  set_protected_users,
  remove_user_protection,
} = require("./users.db.service");
const {
  create_role,
  delete_role_by_role_id,
  create_account,
  update_account,
  get_account_info_by_account_id,
  get_role_names_by_user_id,
  delete_accounts_by_account_ids,
  get_all_roles,
  get_role_by_role_id,
  get_role_by_role_name,
  update_role,
  get_protected_roles,
  set_protected_roles,
  remove_role_protection,
} = require("./roles.db.service");
const {
  get_sign_up_roles,
  get_account_status_enum,
} = require("../aux_microservice/enum.db.service");
const moment = require("moment");
const { response } = require("express");

// encription options
const secret_key = process.env.SECRET_KEY || "abc123";
const token_duration = process.env.TOKEN_DURATION || "4h";

// super user options
const admin = process.env.ADMIN || "admin";
const admin_password = process.env.ADMIN_PASSWORD || "admin";

// local reusable functions
const generate_pagitation_responce = (err, results, req, res) => {
  if (err) {
    console.log(err);
    return error_500(err, res);
  }
  const results_length = results.length;
  if (results.length == 0) {
    return res.status(404).json({
      success: false,
      message: "No records found",
    });
  }
  const body = req.body;
  const requested_page = parseInt(req.headers.page) || parseInt(body.page) || 1;
  const requested_number_of_items_per_page =
    parseInt(req.headers.items_per_page) || parseInt(body.items_per_page) || 10;
  let number_of_available_pages = Math.floor(
    results_length / requested_number_of_items_per_page
  );
  if (results_length % requested_number_of_items_per_page != 0)
    number_of_available_pages++;
  if (requested_page > number_of_available_pages) {
    return res.status(413).json({
      success: false,
      message:
        "Requested page number is higher that number of available pages per given number of items per page",
      requested_number_of_items_per_page: requested_number_of_items_per_page,
      requested_page_number: requested_page,
      number_of_available_records: results_length,
      current_page: requested_page,
      total_available_pages: number_of_available_pages,
    });
  }
  const start = (requested_page - 1) * requested_number_of_items_per_page;
  const result = results.splice(start, requested_number_of_items_per_page);
  console.log(result);
  return res.status(200).json({
    success: true,
    message: "successfull request",
    requested_number_of_items_per_page: requested_number_of_items_per_page,
    requested_page_number: requested_page,
    number_of_available_records: results_length,
    current_page: requested_page,
    total_available_pages: number_of_available_pages,
    number_of_records_fetched: result.length,
    data: result,
  });
};

const success_200s = (code, res, message, results) => {
  return res.status(code).json({
    success: true,
    message: message,
    data: results,
  });
};

const error_400s = (code, res, message, data) => {
  return res.status(code).json({
    success: false,
    message: message,
    data: data,
  });
};

const error_500s = (code, err, res) => {
  return res.status(code).json({
    success: false,
    message: "Internal server error",
    db_error: err.sqlMessage,
  });
};

const reusable_get_user_method = (err, results, res, message) => {
  if (err) {
    console.log(err);
    return error_500s(500, err, res);
  }
  if (!results) {
    return error_400s(404, res, "No users data found");
  }
  return success_200s(200, res, message, results);
};

const verify_ids = (ids, res, callback) => {
  const invalid_ids = ids.filter((any) => {
    if (!/^\d*$/.test(String(any))) return any;
  });
  if (invalid_ids.length > 0)
    return error_400s(
      400,
      res,
      "ids must be digits, wrong ids: " + invalid_ids
    );
  return callback();
};

const check_user_data_for_mistakes = (req, res, callback) => {
  let failures = [];
  if (req.body.first_name.length > 20)
    failures.push("'first_name' has to be no more than 20 characters");
  if (req.body.last_name.length > 20)
    failures.push("'last_name' has to be no more than 20 characters");
  if (req.body.user_login.length > 20)
    failures.push("'user_login' has to be no more than 20 characters");
  if (req.body.password.length > 20)
    failures.push("'password' has to be no more than 20 characters");
  if (
    req.body.phone_number == null ||
    !req.body.phone_number
      .toString()
      .match(/^([0-9]{3})[-]?([0-9]{3})[-]?([0-9]{4})$/)
  )
    failures.push(
      "'phone_number' has to have 10 digits or pattern of '000-000-0000'"
    );
  const email_re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    req.body.e_mail == null ||
    !email_re.test(String(req.body.e_mail).toLowerCase())
  )
    failures.push("'e_mail' has to be example@example.com");
  const date_re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  if (req.body.dob == null || !date_re.test(String(req.body.dob)))
    failures.push("'dob' has to be 'YYYY-MM-DD' format");
  const today = moment();
  const user_dob = moment(req.body.dob).format("YYYY-MM-DD");
  if (today.diff(user_dob, "years") < 18)
    failures.push(
      "age by given date of birth is too young, consumer has to be 18 and older"
    );
  if (failures.length > 0)
    return error_400s(403, res, "invalid fields, please fix values", failures);
  return callback();
};

const check_account_data_for_mistakes = (req, res, callback) => {
  return verify_ids([req.body.user_id, req.body.role_id], res, () => {
    // TO DO implement account_status_enum
    return get_account_status_enum((err, results) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (results.length == 0) {
        return error_400s(
          404,
          res,
          "No account status data found in account_status_enum table, please contact system administrator."
        );
      }
      const existing_account_statuses = [];
      results.forEach((each_row) => {
        existing_account_statuses.push(each_row.account_status);
      });
      if (!existing_account_statuses.includes(req.body.account_status))
        return error_400s(
          400,
          res,
          "invalid account_status. Accepted values : " +
            existing_account_statuses
        );
      if (req.body.termination_date == null) return callback();
      const date_re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
      if (!date_re.test(String(req.body.termination_date)))
        return error_400s(
          400,
          res,
          "invalid termination_date,if provided has to be 'YYYY-MM-DD' format, or null"
        );
      const today = moment();
      const termination_date = moment(req.body.termination_date).format(
        "YYYY-MM-DD"
      );
      if (
        moment().isAfter(moment(req.body.termination_date).format("YYYY-MM-DD"))
      )
        return error_400s(
          403,
          res,
          "it's not allowed to terminate account retroactively"
        );
      return callback();
    });
  });
};

const check_for_protected_user_ids = (user_ids, res, callback) => {
  return get_protected_users((err, results) => {
    if (err) {
      console.log(err);
      return error_500s(500, err, res);
    }
    let protected_user_ids = [];
    results.map((each_json) => {
      protected_user_ids.push(each_json.user_id);
    });
    const found_protected_user_ids = user_ids.filter((user_id) => {
      if (protected_user_ids.includes(user_id)) return user_id;
    });
    if (found_protected_user_ids.length > 0)
      return error_400s(
        403,
        res,
        "user_ids: " +
          found_protected_user_ids +
          " are used by system and protected from modifications and deletions"
      );
    return callback();
  });
};

const check_for_protected_role_ids = (role_ids, res, callback) => {
  const found_protected_role_ids = role_ids.filter((role_id) => {
    if (protected_role_ids.includes(role_id)) return role_id;
  });
  if (found_protected_role_ids.length > 0)
    return error_400s(
      403,
      res,
      "role ids: " +
        found_protected_role_ids +
        " are used by system and protected from modifications and deletions"
    );
  return callback();
};

// controllers
module.exports = {
  create_user: (req, res) => {
    return check_user_data_for_mistakes(req, res, () => {
      req.body.password = hashSync(req.body.password, salt);
      return create_user(req.body, (err, results) => {
        if (err) {
          console.log(err);
          if (err.code == "ER_DUP_ENTRY") {
            return error_400s(409, res, err.sqlMessage);
          }
          return error_500s(500, err, res);
        }
        return success_200s(201, res, "Successfully created new user", {
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
  },
  get_all_users: (req, res) => {
    return get_all_users((err, results) => {
      return generate_pagitation_responce(err, results, req, res);
    });
  },
  get_user_by_id: (req, res) => {
    return verify_ids([req.params.id], res, () => {
      return get_user_by_id(req.params.id, (err, results) => {
        return reusable_get_user_method(
          err,
          results,
          res,
          "Found user by provided user_id"
        );
      });
    });
  },
  search_for_user: (req, res) => {
    const acceptable_search_keys = [
      "user_id",
      "user_login",
      "e_mail",
      "phone_number",
      "first_name",
      "last_name",
    ];
    let acceptable_keys_not_found = true;
    let all_of_acceptable_keys_are_blank = true;
    let not_acceptable_query_parameters = [];
    Object.keys(req.query).forEach((key) => {
      if (acceptable_search_keys.includes(key)) {
        acceptable_keys_not_found = false;
        console.log("initial: " + all_of_acceptable_keys_are_blank);
        const value = req.query[key];
        console.log(key + " " + typeof value + " " + value);
        if (all_of_acceptable_keys_are_blank) {
          if (value !== "" && value !== "*") {
            all_of_acceptable_keys_are_blank = false;
            console.log("bingo!");
            console.log(all_of_acceptable_keys_are_blank);
          }
        }
      } else not_acceptable_query_parameters.push(key);
    });
    if (
      acceptable_keys_not_found ||
      not_acceptable_query_parameters.length > 0 ||
      all_of_acceptable_keys_are_blank
    ) {
      let responce_json = {
        available_query_parameters: [
          "user_id",
          "user_login",
          "e_mail",
          "phone_number",
          "first_name",
          "last_name",
        ],
      };
      if (not_acceptable_query_parameters.length > 0)
        responce_json.not_acceptable_query_parameters =
          not_acceptable_query_parameters;
      if (!acceptable_keys_not_found && all_of_acceptable_keys_are_blank)
        responce_json.invalid_values =
          "all query parameters are empty or *, at least one has to have value";
      return error_400s(403, res, "invalid querry parameter", responce_json);
    }
    return search_user(req.query, (err, results) => {
      return generate_pagitation_responce(err, results, req, res);
    });
  },
  update_user: (req, res) => {
    return check_user_data_for_mistakes(req, res, () => {
      return check_for_protected_user_ids([req.body.user_id], res, () => {
        return update_user(req.body, (err, results) => {
          if (err) {
            console.log(err);
            if (err.code == "ER_DUP_ENTRY") {
              return error_400s(409, res, err.sqlMessage);
            }
            return error_500s(500, err, res);
          }
          if (results.affectedRows == 0)
            return error_400s(
              404,
              res,
              "No users found by user_id " + req.body.user_id
            );
          return success_200s(201, res, "Successfully updated user", {
            user_id: req.body.user_id,
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
  },
  delete_users_by_user_ids: (req, res) => {
    if (!req.body.user_ids)
      return error_400s(400, res, "no user_ids for deletion provided in body");
    const user_ids_to_delete = req.body.user_ids;
    return verify_ids(user_ids_to_delete, res, () => {
      return check_for_protected_user_ids(user_ids_to_delete, res, () => {
        return delete_users_by_user_ids(user_ids_to_delete, (err, results) => {
          if (err) {
            console.log(err);
            return error_500s(500, err, res);
          }
          if (results.affectedRows == 0)
            return error_400s(
              404,
              res,
              "no data was found to delet by user ids: " + user_ids_to_delete
            );
          return success_200s(
            200,
            res,
            "successfully deleted user by ids: " + user_ids_to_delete,
            {
              affectedRows: results.affectedRows,
            }
          );
        });
      });
    });
  },
  get_protected_users: (req, res) => {
    return get_protected_users((err, results) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      let protected_user_ids = [];
      results.map((each_json) => {
        protected_user_ids.push(each_json.user_id);
      });
      return success_200s(200, res, "successfully fetched protected users", {
        protected_user_ids: protected_user_ids,
      });
    });
  },
  set_protected_users: (req, res) => {
    return verify_ids(req.body.user_ids, res, () => {
      set_protected_users(req.body.user_ids, (err, results) => {
        if (err) {
          console.log(err);
          if (err.code == "ER_DUP_ENTRY") {
            return error_400s(409, res, err.sqlMessage);
          }
          return error_500s(500, err, res);
        }
        return success_200s(201, res, "Successfully set protected users", {
          protected_user_ids: req.body.user_ids,
        });
      });
    });
  },
  remove_user_protection: (req, res) => {
    if (!req.body.user_ids)
      return error_400s(
        400,
        res,
        "no user_ids provided in body for removing user protection"
      );
    return verify_ids(req.body.user_ids, res, () => {
      return remove_user_protection(req.body.user_ids, (err, results) => {
        if (err) {
          console.log(err);
          return error_500s(500, err, res);
        }
        if (results.affectedRows == 0)
          return error_400s(
            404,
            res,
            "no data was found by user_ids: " + req.body.user_ids
          );
        return success_200s(
          200,
          res,
          "successfully removed protections for user_ids: " + req.body.user_ids,
          {
            affectedRows: results.affectedRows,
          }
        );
      });
    });
  },
  create_role: (req, res) => {
    return create_role(req.body, (err, results) => {
      if (err) {
        console.log(err);
        if (err.code == "ER_DUP_ENTRY") {
          return error_400s(409, res, err.sqlMessage);
        }
        return error_500s(500, err, res);
      }
      return success_200s(201, res, "Successfully created new role", {
        role_id: results.insertId,
        role_name: req.body.role_name,
        can_create_role: req.body.can_create_role,
        can_modify_role: req.body.can_modify_role,
        can_delete_role: req.body.can_delete_role,
        can_order: req.body.can_order,
        can_create_order: req.body.can_create_order,
        can_modify_order: req.body.can_modify_order,
        can_delete_order: req.body.can_delete_order,
        can_create_user: req.body.can_create_user,
        can_modify_user: req.body.can_modify_user,
        can_delete_user: req.body.can_delete_user,
        can_create_book: req.body.can_create_book,
        can_modify_book: req.body.can_modify_book,
        can_delete_book: req.body.can_delete_book,
        can_read_events: req.body.can_read_events,
      });
    });
  },
  get_all_roles: (req, res) => {
    return get_all_roles((err, results) => {
      return generate_pagitation_responce(err, results, req, res);
    });
  },
  get_role_by_role_id: (req, res) => {
    return verify_ids([req.params.id], res, () => {
      return get_role_by_role_id(req.params.id, (err, results) => {
        if (err) {
          console.log(err);
          return error_500s(500, err, res);
        }
        if (!results) {
          return error_400s(
            404,
            res,
            "No role data found by role_id " + req.params.id
          );
        }
        return success_200s(200, res, "successfully found role", results);
      });
    });
  },
  get_role_by_role_name: (req, res) => {
    if (!req.body.role_name)
      return error_400s(400, res, "no role_name provided in body");
    return get_role_by_role_name(req.body.role_name, (err, results) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (!results) {
        return error_400s(
          404,
          res,
          "No role data found by role_name " + req.body.role_name
        );
      }
      return success_200s(200, res, "successfully found role", results);
    });
  },
  update_role: (req, res) => {
    return check_for_protected_role_ids([req.body.role_id], res, () => {
      return update_role(req.body, (err, results) => {
        if (err) {
          console.log(err);
          if (err.code == "ER_DUP_ENTRY") {
            return error_400s(409, res, err.sqlMessage);
          }
          return error_500s(500, err, res);
        }
        if (results.affectedRows == 0)
          return error_400s(
            404,
            res,
            "No roles found by role_id " + req.body.role_id
          );
        return success_200s(201, res, "Successfully updated role", {
          role_id: req.body.role_id,
          role_name: req.body.role_name,
          can_create_role: req.body.can_create_role,
          can_modify_role: req.body.can_modify_role,
          can_delete_role: req.body.can_delete_role,
          can_order: req.body.can_order,
          can_create_order: req.body.can_create_order,
          can_modify_order: req.body.can_modify_order,
          can_delete_order: req.body.can_delete_order,
          can_create_user: req.body.can_create_user,
          can_modify_user: req.body.can_modify_user,
          can_delete_user: req.body.can_delete_user,
          can_create_book: req.body.can_create_book,
          can_modify_book: req.body.can_modify_book,
          can_delete_book: req.body.can_delete_book,
          can_read_events: req.body.can_read_events,
        });
      });
    });
  },
  delete_roles_by_role_ids: (req, res) => {
    if (!req.body.role_ids)
      return error_400s(400, res, "no role_ids for deletion provided in body");
    const role_ids_to_delete = req.body.role_ids;
    return verify_ids(role_ids_to_delete, res, () => {
      return check_for_protected_role_ids(role_ids_to_delete, res, () => {
        return delete_role_by_role_id(role_ids_to_delete, (err, results) => {
          if (err) {
            console.log(err);
            return error_500s(500, err, res);
          }
          if (results.affectedRows == 0)
            return error_400s(
              404,
              res,
              "no data was found to delet by role_ids: " + role_ids_to_delete
            );
          return success_200s(
            200,
            res,
            "successfully deleted roles by role_ids: " + role_ids_to_delete,
            {
              affectedRows: results.affectedRows,
            }
          );
        });
      });
    });
  },
  get_protected_roles: (req, res) => {
    return get_protected_roles((err, results) => {
      if (err) {
        console.log(err);
        return error_500s(500, err, res);
      }
      if (results.length == 0) {
        return res.status(404).json({
          success: false,
          message: "No records found",
          db_responce: results,
        });
      }
      let protected_role_ids = [];
      results.map((each_json) => {
        protected_role_ids.push(each_json.role_id);
      });
      return success_200s(200, res, "successfully fetched protected roles", {
        protected_role_ids: protected_role_ids,
      });
    });
  },
  set_protected_roles: (req, res) => {
    return verify_ids(req.body.role_ids, res, () => {
      set_protected_roles(req.body.role_ids, (err, results) => {
        if (err) {
          console.log(err);
          if (err.code == "ER_DUP_ENTRY") {
            return error_400s(409, res, err.sqlMessage);
          }
          return error_500s(500, err, res);
        }
        console.log(results);
        return success_200s(201, res, "Successfully set protected roles", {
          protected_role_ids: req.body.role_ids,
        });
      });
    });
  },
  remove_role_protection: (req, res) => {
    if (!req.body.role_ids)
      return error_400s(
        400,
        res,
        "no role_ids provided in body for removing role protection"
      );
    return verify_ids(req.body.role_ids, res, () => {
      return remove_role_protection(req.body.role_ids, (err, results) => {
        if (err) {
          console.log(err);
          return error_500s(500, err, res);
        }
        if (results.affectedRows == 0)
          return error_400s(
            404,
            res,
            "no data was found by role_ids: " + req.body.role_ids
          );
        return success_200s(
          200,
          res,
          "successfully removed protections for role_ids: " + req.body.role_ids,
          {
            affectedRows: results.affectedRows,
          }
        );
      });
    });
  },
  create_account: (req, res) => {
    return check_account_data_for_mistakes(req, res, () => {
      // 1
      return get_role_names_by_user_id(req.body.user_id, (error1, results1) => {
        if (error1) {
          console.log(error1);
          return error_500s(500, error1, res);
        }
        const found_duplicates = results1.filter((role) => {
          if (role.role_id == req.body.role_id) return role;
        });
        if (found_duplicates.length > 0) {
          let duplicates = [];
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
          return error_400s(403, res, "account already exists", {
            duplicates,
          });
        }
        // 2
        return create_account(req.body, (error2, results2) => {
          if (error2) {
            console.log(error2);
            return error_500s(500, error2, res);
          }
          return success_200s(201, res, "Successfully created account", {
            account_id: results2.insertId,
            user_id: req.body.user_id,
            role_id: req.body.role_id,
            account_status: req.body.account_status,
            termination_date: req.body.termination_date,
          });
        });
      });
    });
  },
  update_account: (req, res) => {
    req.body.user_id = 1;
    req.body.role_id = 1;
    return check_account_data_for_mistakes(req, res, () => {
      update_account(req.body, (err, results) => {
        if (err) {
          console.log(err);
          return error_500s(500, err, res);
        }
        return success_200s(201, res, "Successfully updated account", {
          account_id: req.body.account_id,
          account_status: req.body.account_status,
          termination_date: req.body.termination_date,
        });
      });
    });
  },
  get_account_info_by_account_id: (req, res) => {
    return verify_ids([req.params.id], res, () => {
      return get_account_info_by_account_id(req.params.id, (err, results) => {
        if (err) {
          console.log(err);
          return error_500s(500, err, res);
        }
        if (!results) {
          return error_400s(
            404,
            res,
            "No account data found by account_id " + req.params.id
          );
        }
        return success_200s(200, res, "successfully found account", results);
      });
    });
  },
  get_role_names_by_user_id: (req, res) => {
    return verify_ids([req.params.id], res, () => {
      return get_role_names_by_user_id(req.params.id, (err, results) => {
        if (err) {
          console.log(err);
          return error_500s(500, err, res);
        }
        if (!results) {
          return error_400s(
            404,
            res,
            "No roles data found by user_id " + req.params.id
          );
        }
        return success_200s(200, res, "successfully found roles", results);
      });
    });
  },
  delete_accounts_by_account_ids: (req, res) => {
    if (!req.body.account_ids)
      return error_400s(
        400,
        res,
        "account_ids not provided, please provide account_ids as array"
      );
    const account_ids_to_delete = req.body.account_ids;
    return verify_ids(account_ids_to_delete, res, () => {
      return delete_accounts_by_account_ids(
        account_ids_to_delete,
        (err, results) => {
          if (err) {
            console.log(err);
            return error_500s(500, err, res);
          }
          if (results.affectedRows == 0)
            return error_400s(
              404,
              res,
              "no data was found to delet by account_ids: " +
                account_ids_to_delete
            );
          return success_200s(
            200,
            res,
            "successfully deleted accounts by account_ids: " +
              account_ids_to_delete,
            {
              affectedRows: results.affectedRows,
            }
          );
        }
      );
    });
  },
  student_employee_sign_up: (req, res) => {
    // 1
    return get_sign_up_roles((error1, results1) => {
      if (error1) {
        console.log(error1);
        return error_500s(500, error1, res);
      }
      if (results1.length == 0) {
        return error_400s(
          404,
          res,
          "No sign up roles found, please report to system administrator"
        );
      }
      const allowed_sign_up_roles = [];
      results1.forEach((each_row) => {
        allowed_sign_up_roles.push(each_row.role_name);
      });
      console.log("sign up roles are " + allowed_sign_up_roles);
      if (!allowed_sign_up_roles.includes(req.body.role_name))
        return error_400s(
          401,
          res,
          "provided role '" +
            req.body.role_name +
            "' is not allowed as sign up role",
          {
            allowed_sign_up_roles: allowed_sign_up_roles,
          }
        );
      // 2
      return get_role_by_role_name(req.body.role_name, (error2, results2) => {
        if (error2) {
          console.log(error2);
          return error_500s(500, error2, res);
        }
        if (!results2) {
          return error_400s(
            404,
            res,
            "No role data found by role_name " + req.body.role_name
          );
        }
        req.body.role_id = results2.role_id;
        // 3
        return check_user_data_for_mistakes(req, res, () => {
          return check_account_data_for_mistakes(req, res, () => {
            req.body.password = hashSync(req.body.password, salt);
            return create_user(req.body, (error3, results3) => {
              if (error3) {
                console.log(error3);
                if (error3.code == "ER_DUP_ENTRY") {
                  return error_400s(409, res, error3.sqlMessage);
                }
                return error_500s(500, error3, res);
              }
              req.body.user_id = results3.insertId;
              // 4
              return create_account(req.body, (error4, results4) => {
                if (error4) {
                  console.log(error4);
                  return error_500s(500, error4, res);
                }
                return success_200s(
                  201,
                  res,
                  "Successfully signed up as " + req.body.role_name,
                  {
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
                  }
                );
              });
            });
          });
        });
      });
    });
  },
};
