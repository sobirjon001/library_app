// import libraries
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const salt = genSaltSync(10);
const { sign } = require("jsonwebtoken");
const {
  create_user,
  delete_user_by_id,
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
  create_role,
  delete_role_by_role_id,
  delete_user_role_by_user_role_id,
  get_all_roles,
  get_role_by_id,
  get_role_by_role_name,
  get_user_role_info_by_user_role_id,
  get_user_role_names_by_user_id,
  set_user_role,
  update_role,
  update_user_role_by_user_role_id,
} = require("./roles.db.service");
const res = require("express/lib/response");
const moment = require("moment");

// encription options
const secret_key = process.env.SECRET_KEY || "abc123";

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
  return res.status(200).json({
    success: true,
    message: "successfull request",
    requested_number_of_items_per_page: requested_number_of_items_per_page,
    requested_page_number: requested_page,
    number_of_available_records: results_length,
    current_page: requested_page,
    total_available_pages: number_of_available_pages,
    data: result,
  });
};

const error_500 = (err, res) => {
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    db_error: err.sqlMessage,
  });
};

const error_404 = (res) => {
  return res.status(404).json({
    success: false,
    message: "Record not found",
  });
};

const error_400 = (res, message) => {
  return res.status(400).json({
    success: false,
    message: message,
  });
};

const reusable_get_user_method = (err, results, res, message) => {
  if (err) {
    console.log(err);
    return error_500(err, res);
  }
  if (!results) {
    return error_404(res);
  }
  return res.status(200).json({
    success: true,
    message: message,
    data: results,
  });
};

const check_user_data_for_mistakes = (req, res, callback) => {
  if (
    req.body.phone_number == null ||
    !req.body.phone_number.toString().match(/^\d{10}$/)
  )
    return error_400(res, "invalid phone number, has to be 10 digits");
  const email_re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    req.body.e_mail == null ||
    !email_re.test(String(req.body.e_mail).toLowerCase())
  )
    return error_400(res, "invalid email, has to be example@example.com");
  const date_re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  if (req.body.dob == null || !date_re.test(String(req.body.dob)))
    return error_400(
      res,
      "invalid date of birth, has to be 'YYYY-MM-DD' format"
    );
  else {
    const today = moment();
    console.log(today);
    const user_dob = moment(req.body.dob).format("YYYY-MM-DD");
    if (today.diff(user_dob, "years") < 18)
      return error_400(
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
            return res.status(409).json({
              success: false,
              message: err.sqlMessage,
            });
          }
          return error_500(err, res);
        }
        return res.status(201).json({
          success: true,
          message: "Successfully added new user",
          user_id: results.insertId,
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
};
