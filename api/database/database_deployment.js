// import libraries
const { resolve } = require("path");
const pool = require("./database.js");
const { genSaltSync, hashSync } = require("bcrypt");
const {
  create_user,
  set_protected_users,
} = require("../users_microservice/users.db.service");
const {
  create_role,
  set_protected_roles,
} = require("../users_microservice/roles.db.service");

const salt = genSaltSync(10);

const table_schema = process.env.DB_SCHEMA || "library_db";
const table_structure = require("./table_structure.js");
const admin = process.env.ADMIN || "admin";
const admin_password = process.env.ADMIN_PASSWORD || "admin";

// TO DO create enabler super admin

const table_exist = async (name) => {
  return new Promise((resolve, reject) => {
    console.log(`Checking if table ${name} exists`);
    pool.query(
      `select exists(
        select 1 from information_schema.tables
        where table_schema = '${table_schema}'
        and table_name = '${name}'
      ) as 'exist';`,
      [],
      (err, results, fields) => {
        if (err) reject(err);
        if (results[0].exist == 0) {
          console.log(`Table ${name} does't exist`);
          return resolve(false);
        } else {
          console.log(`Table ${name} exist`);
          return resolve(true);
        }
      }
    );
  });
};

const create_table = (name, query) => {
  return new Promise((resolve, reject) => {
    console.log(`Creating table ${name} . . .`);
    pool.query(`${query}`, [], (err, results, fields) => {
      if (err) return reject(err);
      else return resolve();
    });
  });
};

const test_table_structure = (i, next) => {
  if (i == table_structure.length) return next();
  table_exist(table_structure[i].name).then(async (resolve) => {
    if (!resolve)
      create_table(table_structure[i].name, table_structure[i].query)
        .then(() => {
          test_table_structure(++i, next);
        })
        .catch((err) => {
          console.log(err);
          return next();
        });
    else test_table_structure(++i, next);
  });
};

const test_super_user_exist = (next) => {
  console.log("Checking if super user exists . . .");
  pool.query(
    `select exists(
      select 1 from users
      where user_login = ?
    ) as 'exist';`,
    [admin],
    (error, results, fields) => {
      if (error) throw new Error(error);
      if (results[0].exist == 0) {
        console.log("Super user doesn't exist, creating . . .");
        const admin_hash_password = hashSync(admin_password, salt);
        const data = {
          first_name: "Enabler",
          last_name: "Account",
          dob: "2022-03-17",
          user_login: admin,
          password: admin_hash_password,
          e_mail: "admin@library.com",
          phone_number: 1234567890,
        };
        return create_user(data, (error1, results1) => {
          if (error1)
            console.log("Failed to create Super user!\n" + error1.message);
          if (results1) {
            console.log("Successfully created super admin!");
            return set_protected_users(
              [results1.insertId],
              (error2, results2) => {
                if (error2)
                  console.log(
                    "Failed to set protection for Super user!\n" +
                      error2.message
                  );
                if (results2) {
                  console.log("Successfully set protection for super admin!");
                  return next();
                }
              }
            );
          }
        });
      } else {
        console.log("Super user exists, please login as:");
        return next();
        // TO DO implement get admin credentials and console log
      }
    }
  );
};

const test_qa_role_exist = (next) => {
  console.log("Checking if QA role exists . . .");
  pool.query(
    `select exists(
      select 1 from roles
      where role_name = ?
    ) as exist;`,
    ["QA"],
    (error, results, fields) => {
      if (error) throw new Error(error);
      if (results[0].exist == 0) {
        console.log("QA role doesn't exist, creating . . .");
        const data = {
          role_name: "QA",
          can_create_role: true,
          can_modify_role: true,
          can_delete_role: true,
          can_order: true,
          can_create_order: true,
          can_modify_order: true,
          can_delete_order: true,
          can_create_user: true,
          can_modify_user: true,
          can_delete_user: true,
          can_create_book: true,
          can_modify_book: true,
          can_delete_book: true,
          can_read_events: true,
        };
        return create_role(data, (error1, results1) => {
          if (error1)
            console.log("Failed to create QA role!\n" + error1.message);
          if (results1) {
            console.log("Successfully created QA role!");
            return set_protected_roles(
              [results1.insertId],
              (error2, results2) => {
                if (error2)
                  console.log(
                    "Failed to set protection for QA role!\n" + error2.message
                  );
                if (results2) {
                  console.log("Successfully set protection for QA role!");
                  return next();
                }
              }
            );
          }
        });
      } else {
        console.log("QA role exists");
        return next();
      }
    }
  );
};

const test_student_role_exist = (next) => {
  console.log("Checking if student role exists . . .");
  pool.query(
    `select exists(
      select 1 from roles
      where role_name = ?
    ) as exist;`,
    ["student"],
    (error, results, fields) => {
      if (error) throw new Error(error);
      if (results[0].exist == 0) {
        console.log("student role doesn't exist, creating . . .");
        const data = {
          role_name: "student",
          can_create_role: false,
          can_modify_role: false,
          can_delete_role: false,
          can_order: true,
          can_create_order: false,
          can_modify_order: false,
          can_delete_order: false,
          can_create_user: false,
          can_modify_user: false,
          can_delete_user: false,
          can_create_book: false,
          can_modify_book: false,
          can_delete_book: false,
          can_read_events: false,
        };
        return create_role(data, (error1, results1) => {
          if (error1)
            console.log("Failed to create student role!\n" + error1.message);
          if (results1) {
            console.log("Successfully created student role!");
            return set_protected_roles(
              [results1.insertId],
              (error2, results2) => {
                if (error2)
                  console.log(
                    "Failed to set protection for student role!\n" +
                      error2.message
                  );
                if (results2) {
                  console.log("Successfully set protection for student role!");
                  return next();
                }
              }
            );
          }
        });
      } else {
        console.log("Student role exists");
        return next();
      }
    }
  );
};

module.exports = (next) => {
  return test_table_structure(0, () => {
    return test_super_user_exist(() => {
      return test_qa_role_exist(() => {
        return test_student_role_exist(next);
      });
    });
  });
};
