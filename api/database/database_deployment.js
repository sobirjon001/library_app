// import libraries
const { resolve } = require("path");
const pool = require("./database.js");
const { genSaltSync, hashSync } = require("bcrypt");

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
          resolve(false);
        } else {
          console.log(`Table ${name} exist`);
          resolve(true);
        }
      }
    );
  });
};

const create_table = (name, query) => {
  return new Promise((resolve, reject) => {
    console.log(`Creating table ${name} . . .`);
    pool.query(`${query}`, [], (err, results, fields) => {
      if (err) reject(err);
      else resolve();
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
          next();
        });
    else test_table_structure(++i, next);
  });
};

const test_super_user_exist = (next) => {
  console.log("Checking if super user exists . . .");
  pool.query(
    `select exists(
      select 1 from users
      where account_login = ?
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
          account_login: admin,
          password: admin_hash_password,
          e_mail: "admin@library.com",
          phone_number: 1234567890,
        };
        return next();
        // TO DO implement creating user
        // create_user(data, (err, res) => {
        //   if (err) console.log("Failed to create Super user!\n" + err.message);
        //   if (res) {
        //     console.log("Successfully created super admin!");
        //     return next();
        //   }
        // });
      } else {
        console.log("Super user exists, please login as:");
        // TO DO implement get admin credentials and console log
      }
    }
  );
};

module.exports = (next) => {
  test_table_structure(0, () => {
    test_super_user_exist(next);
  });
};
