// import libraries
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, removeAdditional: "all" });

// import schemas
let new_role_schema = require("./json/create_role.json");
ajv.addSchema(new_role_schema, "new-role");

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
        return res.send(errorResponse(ajv.errors));
      }
      next();
    };
  },
};
