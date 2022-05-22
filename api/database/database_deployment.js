// import libraries
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
const {
  save_to_sign_up_roles,
  save_to_account_status_enum,
} = require("../aux_microservice/enum.db.service");

const salt = genSaltSync(10);

const table_schema = process.env.MYSQL_DATABASE || "library_db";
const table_structure = require("./table_structure.js");
const admin = process.env.ADMIN || "admin";
const admin_password = process.env.ADMIN_PASSWORD || "admin";
const {
  system_roles,
  account_statuses,
  sign_up_roles,
} = require("./configuration");

const table_exist = async (name, callback) => {
  console.log(`Checking if table ${name} exists`);
  pool.query(
    `select exists(
        select 1 from information_schema.tables
        where table_schema = '${table_schema}'
        and table_name = '${name}'
      ) as 'exist';`,
    [],
    (err, results) => {
      if (err) console.log(err);
      if (results[0].exist === 0) {
        console.log(`Table ${name} does't exist`);
        return callback(false);
      } else {
        console.log(`Table ${name} exist`);
        return callback(true);
      }
    }
  );
};

const create_table = (name, query) => {
  return new Promise((resolve) => {
    console.log(`Creating table ${name} . . .`);
    pool.query(`${query}`, [], (err) => {
      if (err) console.log(err);
      resolve();
    });
  });
};

const test_table_structure = (i, next) => {
  if (i === table_structure.length) return next();
  table_exist(table_structure[i].name, async (exist) => {
    if (!exist)
      await create_table(table_structure[i].name, table_structure[i].query);
    return test_table_structure(++i, next);
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
      if (results[0].exist === 0) {
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
        console.log("Super user exists, please login as " + admin);
        return next();
      }
    }
  );
};

const save_system_role = (i, system_roles, callback) => {
  if (i === system_roles.length) return callback();
  return create_role(system_roles[i], (error1, results1) => {
    if (error1)
      console.log(
        "Failed to create " +
          system_roles[i].role_name +
          " role!\n" +
          error1.message
      );
    if (results1) {
      console.log(
        "Successfully created " + system_roles[i].role_name + " role!"
      );
      return set_protected_roles([results1.insertId], (error2, results2) => {
        if (error2)
          console.log(
            "Failed to set protection for " +
              system_roles[i].role_name +
              " role!\n" +
              error2.message
          );
        if (results2) {
          console.log(
            "Successfully set protection for " +
              system_roles[i].role_name +
              " role!"
          );
          return save_system_role(++i, system_roles, callback);
        }
      });
    }
  });
};

const test_system_roles_exist = (next) => {
  // 1
  pool.query(`select * from roles`, [], (error1, results1, fields) => {
    if (error1) console.log(error1);
    let existing_roles = results1.reduce((result, role) => {
      result.push(role.role_name);
      return result;
    }, []);
    const abcent_system_roles = system_roles.filter((system_role) => {
      if (!existing_roles.includes(system_role.role_name)) return system_role;
    });
    if (abcent_system_roles.length === 0) {
      let system_role_names = system_roles.reduce((result, role) => {
        result.push(role.role_name);
        return result;
      }, []);
      console.log("system roles [" + system_role_names + "] exist");
      return next();
    }
    // 2
    let system_role_names = abcent_system_roles.reduce((result, role) => {
      result.push(role.role_name);
      return result;
    }, []);
    console.log(
      "system roles [" + system_role_names + "] don't exist, creating . . ."
    );
    return save_system_role(0, abcent_system_roles, next);
  });
};

const test_sign_up_roles_exist = (next) => {
  // 1
  pool.query(`select * from sign_up_roles`, (error1, results1) => {
    if (error1) console.log(error1);
    const abcent_sign_up_roles = sign_up_roles.filter((sign_up_role) => {
      if (!results1.includes(sign_up_role)) return sign_up_role;
    });
    if (abcent_sign_up_roles.length === 0) {
      console.log("sign up roles [" + sign_up_roles + "] exist");
      return next();
    }
    // 2
    console.log(
      "sign up roles [" + abcent_sign_up_roles + "] don't exist, creating . . ."
    );
    return save_to_sign_up_roles(abcent_sign_up_roles, (error2, results2) => {
      if (error2)
        console.log(
          "Failed to save sign up roles [" +
            abcent_sign_up_roles +
            "] !\n" +
            error2.message
        );
      if (results2)
        console.log(
          "Successfully saved sign up roles [" + abcent_sign_up_roles + "] !"
        );
      return next();
    });
  });
};

const test_account_status_enums_exist = (next) => {
  // 1
  console.log(
    "checking if account status enum table hase account statuses . . ."
  );
  pool.query(`select * from account_status_enum`, (error1, results1) => {
    if (error1) throw new Error(error1);
    const abcent_account_statuses = account_statuses.filter(
      (account_status) => {
        if (!results1.includes(account_status)) return account_status;
      }
    );
    if (abcent_account_statuses.length === 0) {
      console.log("account statuses [" + account_statuses + "] exist");
      return next();
    }
    // 2
    console.log(
      "account statuses [" +
        abcent_account_statuses +
        "] don't exist, creating . . ."
    );
    return save_to_account_status_enum(
      abcent_account_statuses,
      (error2, results2) => {
        if (error2)
          console.log(
            "Failed to save account statuses [" +
              abcent_account_statuses +
              "] !\n" +
              error2.message
          );
        if (results2)
          console.log(
            "Successfully saved account status [" +
              abcent_account_statuses +
              "] !"
          );
        return next();
      }
    );
  });
};

module.exports = (next) => {
  return test_table_structure(0, () => {
    return test_super_user_exist(() => {
      return test_system_roles_exist(() => {
        return test_sign_up_roles_exist(() => {
          return test_account_status_enums_exist(next);
        });
      });
    });
  });
};
