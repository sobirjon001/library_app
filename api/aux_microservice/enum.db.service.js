const pool = require("../database/database");

module.exports = {
  save_to_sign_up_roles: (role_names, callback) => {
    let values_string = "";
    role_names.map((role_name, index) => {
      if (index != role_names.length - 1)
        values_string = values_string.concat(`('${role_name}'),\n`);
      else values_string = values_string.concat(`('${role_name}');`);
    });
    pool.query(
      `insert ignore into sign_up_roles(role_name) values ${values_string}`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_sign_up_roles: (callback) => {
    pool.query(`select * from sign_up_roles`, [], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
  save_to_account_status_enum: (account_statuses, callback) => {
    let values_string = "";
    account_statuses.map((account_status, index) => {
      if (index != account_statuses.length - 1)
        values_string = values_string.concat(`('${account_status}'),\n`);
      else values_string = values_string.concat(`('${account_status}');`);
    });
    pool.query(
      `insert ignore into account_status_enum(account_status) values ${values_string}`,
      [],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_account_status_enum: (callback) => {
    pool.query(`select * from account_status_enum`, [], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
};
