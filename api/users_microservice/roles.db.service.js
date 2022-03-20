const pool = require("../database/database");

module.exports = {
  create_role: (data, callback) => {
    pool.query(
      `insert into roles (
        role_name,
        can_create_role,
        can_modify_role,
        can_delete_role,
        can_order,
        can_create_order,
        can_modify_order,
        can_delete_order,
        can_create_user,
        can_modify_user,
        can_delete_user,
        can_create_book,
        can_modify_book,
        can_delete_book,
        can_read_events
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.role_name,
        data.can_create_role,
        data.can_modify_role,
        data.can_delete_role,
        data.can_order,
        data.can_create_order,
        data.can_modify_order,
        data.can_delete_order,
        data.can_create_user,
        data.can_modify_user,
        data.can_delete_user,
        data.can_create_book,
        data.can_modify_book,
        data.can_delete_book,
        data.can_read_events,
      ],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_all_roles: (callback) => {
    pool.query(`select * from roles`, [], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
  get_role_by_id: (id, callback) => {
    pool.query(`select * from roles where role_id = ?`, [id], (err, res) => {
      if (err) return callback(err);
      return callback(null, res[0]);
    });
  },
  get_role_by_role_name: (role_name, callback) => {
    pool.query(
      `select * from roles where role_name = ?`,
      [role_name],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res[0]);
      }
    );
  },
  update_role: (data, callback) => {
    pool.query(
      `update roles set
        role_name = ?,
        can_create_role = ?,
        can_modify_role = ?,
        can_delete_role = ?,
        can_order = ?,
        can_create_order = ?,
        can_modify_order = ?,
        can_delete_order = ?,
        can_create_user = ?,
        can_modify_user = ?,
        can_delete_user = ?,
        can_create_book = ?,
        can_modify_book = ?,
        can_delete_book = ?,
        can_read_events = ?
      where role_id = ?;`,
      [
        data.role_name,
        data.can_create_role,
        data.can_modify_role,
        data.can_delete_role,
        data.can_order,
        data.can_create_order,
        data.can_modify_order,
        data.can_delete_order,
        data.can_create_user,
        data.can_modify_user,
        data.can_delete_user,
        data.can_create_book,
        data.can_modify_book,
        data.can_delete_book,
        data.can_read_events,
        data.role_id,
      ],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  delete_role_by_role_id: (role_id, callback) => {
    pool.query(`delete from roles where role_id = ?`, [role_id], (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    });
  },
  create_account: (data, callback) => {
    pool.query(
      `insert into accounts (
        user_id,
        role_id,
        account_status,
        termination_data
      )
      values(?, ?, ?, ?);`,
      [data.user_id, data.role_id, data.account_status, data.termination_data],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  update_account: (data, callback) => {
    pool.query(
      `update accounts set
        account_status = ?,
        termination_data = ?
      where account_id = ?;`,
      [data.account_status, data.termination_data, data.account_id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_role_names_by_user_id: (user_id, callback) => {
    pool.query(
      `SELECT r.role_id, r.role_name, ac.account_id, ac.account_status, ac.termination_date
      FROM roles r
      LEFT JOIN accounts ac on r.role_id = ac.role_id
      LEFT JOIN users u on ac.user_id = u.user_id
      WHERE u.user_id = ?;`,
      [user_id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  get_account_info_by_account_id: (account_id, callback) => {
    pool.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.dob, u.e_mail, u.phone_number,
        ac.account_id, ac.account_status, ac.termination_date,
        r.role_id, r.role_name, r.can_create_role, r.can_modify_role, r.can_delete_role,
        r.can_order, r.can_create_order, r.can_modify_order, r.can_delete_order,
        r.can_create_user, r.can_modify_user, r.can_delete_user,
        r.can_create_book, r.can_modify_book, r.can_delete_book, r.can_read_events
      FROM roles r 
        LEFT JOIN accounts ac on r.role_id = ac.role_id
        LEFT JOIN users u on ac.user_id = u.user_id
      WHERE ac.account_id = ?;`,
      [account_id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
  delete_account_by_account_id: (account_id, callback) => {
    pool.query(
      `delete from accounts where account_id = ?`,
      [account_id],
      (err, res) => {
        if (err) return callback(err);
        return callback(null, res);
      }
    );
  },
};
