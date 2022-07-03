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
  search_user: (data, callback) => {
    let search_parameters = "";
    Object.keys(data).forEach((key) => {
      if (data[key] && data[key] !== "*" && data[key] !== "") {
        if (search_parameters === "")
          search_parameters = `where ${key} = '${data[key]}'`;
        else
          search_parameters =
            search_parameters + `\n\tand ${key} = '${data[key]}'`;
      }
    });
    pool.query(
      `select user_id, first_name, last_name, dob, user_login, e_mail, phone_number
      from users
      ${search_parameters}`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  update_user: (data, callback) => {
    let columns_to_update = Object.keys(data).reduce((result, key) => {
      if (key !== "user_id") result = result + `, ${key} = '${data[key]}'`;
      return result;
    }, "");
    columns_to_update = columns_to_update.substring(2);
    pool.query(
      `update users set ${columns_to_update}
        where user_id = ?`,
      [data.user_id],
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
  check_existing_user_ids: (ids, callback) => {
    pool.query(
      `select user_id from users where user_id in (?)`,
      [ids],
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
      `insert ignore into protected_users(user_id) values ${values_string}`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  remove_user_protection: (ids, callback) => {
    pool.query(
      `delete ignore from protected_users where user_id in (?)`,
      [ids],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
};
