// import libraries
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, removeAdditional: "all" });

// import schemas
const new_user_schema = require("./json/create_user.json");
ajv.addSchema(new_user_schema, "new-user");
const update_user_schema = require("./json/update_user.json");
ajv.addSchema(update_user_schema, "update-user");
const new_role_schema = require("./json/create_role.json");
ajv.addSchema(new_role_schema, "new-role");
const update_role_schema = require("./json/update_role.json");
ajv.addSchema(update_role_schema, "update-role");
const create_account = require("./json/create_account.json");
ajv.addSchema(create_account, "create-account");
const update_account = require("./json/update_account.json");
ajv.addSchema(update_account, "update-account");
const student_employee_sign_up = require("./json/student_employee_sugn_up.json");
ajv.addSchema(student_employee_sign_up, "sign-up");

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.instancePath.substring(1),
      key: error.keyword,
      message: error.message,
    };
  });
  return {
    success: false,
    message: "invalid json schema",
    errors: errors,
  };
}

module.exports = {
  /**
   * Validates incoming request bodies against the given schema,
   * providing an error response when validation fails
   * @param  {String} schemaName - name of the schema to validate
   * @return {Object} response
   */
  validateSchema: (schemaName) => {
    return (req, res, next) => {
      let valid = ajv.validate(schemaName, req.body);
      if (!valid) {
        return res.status(403).send(errorResponse(ajv.errors));
      }
      next();
    };
  },
};
