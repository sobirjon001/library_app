const pool = require("../database/database");

module.exports = {
  create_user: (data, callback) => {
    pool.query(
      `insert into users (first_name, last_name, dob, user_login, password, e_mail, phone_number)
        values(?,?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.dob,
        data.user_login,
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
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_user_by_id: (id, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users
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
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users
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
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users
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
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users
        where phone_number = ?`,
      [phone_number],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  get_user_by_account_login: (user_login, callback) => {
    pool.query(
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number from users
        where user_login = ?`,
      [user_login],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  update_user: (data, callback) => {
    pool.query(
      `update users set first_name = ?, last_name = ?, dob = ?, user_login = ?, e_mail = ?, phone_number = ?
        where user_id = ?`,
      [
        data.first_name,
        data.last_name,
        data.dob,
        data.user_login,
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
      `update users set password = ? where user_id = ?`,
      [data.password, data.user_id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  delete_users_by_user_ids: (ids, callback) => {
    pool.query(`delete from users where user_id in (?)`, [ids], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
  get_protected_users: (callback) => {
    pool.query(`select * from protected_users`, [], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
  set_protected_users: (protected_user_ids, callback) => {
    let values_string = "";
    protected_user_ids.map((protected_user_id, index) => {
      if (index != protected_user_ids.length - 1)
        values_string = values_string + `(${protected_user_id}),\n`;
      else values_string = values_string + `(${protected_user_id});`;
    });
    pool.query(
      `insert into protected_users(user_id) values ${values_string}`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  remove_user_protection: (ids, callback) => {
    pool.query(
      `delete from protected_users where user_id in (?)`,
      [ids],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
};
