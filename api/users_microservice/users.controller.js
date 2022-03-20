// import libraries
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const salt = genSaltSync(10);
const { sign } = require("jsonwebtoken");
const {
  create_user,
  delete_users_by_user_ids,
  get_all_users,
  get_user_by_account_login,
  get_user_by_e_mail,
  get_user_by_full_name,
  get_user_by_id,
  get_user_by_phone_number,
  update_user,
  update_user_password,
} = require("./users.db.service");
const {
  create_account,
  create_role,
  delete_account_by_account_id,
  delete_role_by_role_id,
  get_account_info_by_account_id,
  get_all_roles,
  get_role_by_id,
  get_role_by_role_name,
  get_role_names_by_user_id,
  update_account,
  update_role,
} = require("./roles.db.service");
const moment = require("moment");

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
  if (results_length == 0) {
    return res.status(404).json({
      success: false,
      message: "No records found",
      db_responce: results,
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

const error_400s = (code, res, message) => {
  return res.status(code).json({
    success: false,
    message: message,
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

const check_user_data_for_mistakes = (req, res, callback) => {
  if (
    req.body.phone_number == null ||
    !req.body.phone_number.toString().match(/^\d{10}$/)
  )
    return error_400s(400, res, "invalid phone number, has to be 10 digits");
  const email_re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    req.body.e_mail == null ||
    !email_re.test(String(req.body.e_mail).toLowerCase())
  )
    return error_400s(400, res, "invalid email, has to be example@example.com");
  const date_re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  if (req.body.dob == null || !date_re.test(String(req.body.dob)))
    return error_400s(
      400,
      res,
      "invalid date of birth, has to be 'YYYY-MM-DD' format"
    );
  else {
    const today = moment();
    const user_dob = moment(req.body.dob).format("YYYY-MM-DD");
    if (today.diff(user_dob, "years") < 18)
      return error_400s(
        400,
        res,
        "age by given date of birth is too young, consumer has to be 18 and older"
      );
  }
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
    get_all_users((err, results) => {
      return generate_pagitation_responce(err, results, req, res);
    });
  },
  get_user_by_id: (rec, res) => {
    get_user_by_id(rec.params.id, (err, results) => {
      return reusable_get_user_method(
        err,
        results,
        res,
        "Found user by provided user_id"
      );
    });
  },
  search_for_user: (req, res) => {
    if (req.query.id)
      return get_user_by_id(req.query.id, (err, results) => {
        return reusable_get_user_method(
          err,
          results,
          res,
          "Found user by provided user_id"
        );
      });
    if (req.query.account_login)
      return get_user_by_account_login(
        req.query.account_login,
        (err, results) => {
          return reusable_get_user_method(
            err,
            results,
            res,
            "Found user by provided account_login"
          );
        }
      );
    if (req.query.e_mail)
      return get_user_by_e_mail(req.query.e_mail, (err, results) => {
        return reusable_get_user_method(
          err,
          results,
          res,
          "Found user by provided e_mail"
        );
      });
    if (req.query.phone_number)
      return get_user_by_phone_number(
        req.query.phone_number,
        (err, results) => {
          return reusable_get_user_method(
            err,
            results,
            res,
            "Found user by provided phone_number"
          );
        }
      );
    if (req.query.full_name)
      return get_user_by_full_name(req.query.full_name, (err, results) => {
        return generate_pagitation_responce(err, results, req, res);
      });
    return res.status(403).json({
      success: false,
      message: "invalid querry parameter",
      used_query_parameters: req.query,
      available_query_parameters: [
        "id",
        "account_login",
        "e_mail",
        "phone_number",
        "full_name",
      ],
    });
  },
  update_user: (req, res) => {
    return check_user_data_for_mistakes(req, res, () => {
      if (req.body.user_id == 1)
        return error_400s(
          403,
          res,
          "user id = 1 is administrator account and protected from modifications"
        );
      return update_user(req.body, (err, results) => {
        if (err) {
          console.log(err);
          if (err.code == "ER_DUP_ENTRY") {
            return error_400s(409, res, err.sqlMessage);
          }
          return error_500s(500, err, res);
        }
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
  },
  delete_users_by_user_ids: (req, res) => {
    if (!req.body.user_ids)
      return error_400s(400, res, "no user_ids for deletion provided in body");
    const user_ids_to_delete = req.body.user_ids;
    const invalid_user_ids = user_ids_to_delete.filter((any) => {
      if (!/^\d*$/.test(String(any))) return any;
    });
    if (invalid_user_ids.length > 0)
      return error_400s(
        400,
        res,
        "user_ids must me digits, wrong ids: " + invalid_user_ids
      );
    if (user_ids_to_delete.includes(1))
      return error_400s(
        403,
        res,
        "user id = 1 is administrator account and protected from deletions"
      );
    delete_users_by_user_ids(user_ids_to_delete, (err, results) => {
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
};
