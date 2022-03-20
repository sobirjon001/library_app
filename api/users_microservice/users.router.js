// import libraries
const router = require("express").Router();
const {
  create_user,
  delete_users_by_user_ids,
  get_all_users,
  get_user_by_id,
  search_for_user,
  update_user,
  create_role,
} = require("./users.controller");
const {
  validateSchema,
} = require("../json_schema_validation/json_schema_validator");

router.post("/sign_up", create_user);
router.get("/", get_all_users);
router.get("/search", search_for_user);
router.get("/:id", get_user_by_id);
router.patch("/update", update_user);
router.delete("/", delete_users_by_user_ids);
router.post("/role", validateSchema("new-role"), create_role);

module.exports = router;
