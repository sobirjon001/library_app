const pool = require("../database/database");

module.exports = {
  create_user: (data, callback) => {
    pool.query(
      `insert into users (first_name, last_name, dob, account_login, password, e_mail, phone_number)
        values(?,?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.dob,
        data.account_login,
        data.password,
        data.e_mail,
        data.phone_number,
      ],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_all_users: (callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, account_login, e_mail, phone_number from users`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_user_by_id: (id, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, account_login, e_mail, phone_number from users
        where user_id = ?`,
      [id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  get_user_by_full_name: (full_name, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, account_login, e_mail, phone_number from users
        where concat(first_name, ' ', last_name) = ?`,
      [full_name],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_user_by_e_mail: (e_mail, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, account_login, e_mail, phone_number from users
        where e_mail = ?`,
      [e_mail],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  get_user_by_phone_number: (phone_number, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, account_login, e_mail, phone_number from users
        where phone_number = ?`,
      [phone_number],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  get_user_by_account_login: (account_login, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, account_login, e_mail, phone_number from users
        where account_login = ?`,
      [account_login],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  update_user: (data, callback) => {
    pool.query(
      `ubdate users set first_name = ?, last_name = ?, dob = ?, account_login = ?, e_mail = ?, phone_number = ?
        where user_id = ?`,
      [
        data.first_name,
        data.last_name,
        data.dob,
        data.account_login,
        data.e_mail,
        data.phone_number,
        data.user_id,
      ],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  update_user_password: (data, callback) => {
    pool.query(
      `ubdate users set password = ? where user_id = ?`,
      [data.password, data.user_id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  delete_user_by_id: (id, callback) => {
    pool.query(`delete from users where user_id = ?`, [id], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
};
