// import libraries
const Ajv = require("ajv");
// const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const ajv = new Ajv({ allErrors: true });
const schema = require("./schemas");

// import schemas
ajv.addSchema(schema.create_user, "new-user");
ajv.addSchema(schema.update_user, "update-user");
ajv.addSchema(schema.create_role, "new-role");
ajv.addSchema(schema.update_role, "update-role");
+ajv.addSchema(schema.create_account, "create-account");
ajv.addSchema(schema.update_account, "update-account");
ajv.addSchema(schema.student_employeesign_up, "sign-up");

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
      const valid = ajv.validate(schemaName, req.body);
      if (!valid) {
        return res.status(403).send(errorResponse(ajv.errors));
      }
      return next();
    };
  },
};
