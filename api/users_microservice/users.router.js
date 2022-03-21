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
  get_all_roles,
  get_role_by_role_id,
  update_role,
  delete_roles_by_role_ids,
  get_protected_users,
  set_protected_users,
  get_protected_roles,
  set_protected_roles,
  remove_user_protection,
  remove_role_protection,
  get_role_by_role_name,
} = require("./users.controller");
const {
  validateSchema,
} = require("../json_schema_validation/json_schema_validator");

router.get("/", get_all_users);
router.get("/search", search_for_user);
router.get("/protected", get_protected_users);
router.get("/protected_roles", get_protected_roles);
router.get("/all_roles", get_all_roles);
router.get("/role_by_role_name", get_role_by_role_name);
router.get("/role/:id", get_role_by_role_id);
router.get("/:id", get_user_by_id);
router.post("/create", validateSchema("new-user"), create_user);
router.post("/protected", set_protected_users);
router.post("/create_role", validateSchema("new-role"), create_role);
router.post("/protected_roles", set_protected_roles);
router.patch("/update", validateSchema("update-user"), update_user);
router.patch("/update_role", validateSchema("update-role"), update_role);
router.patch("/protected", remove_user_protection);
router.patch("/protected_roles", remove_role_protection);
router.delete("/", delete_users_by_user_ids);
router.delete("/delete_roles", delete_roles_by_role_ids);

module.exports = router;
