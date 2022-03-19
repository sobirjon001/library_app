// import libraries
const router = require("express").Router();
const {
  create_user,
  get_all_users,
  get_user_by_id,
  search_for_user,
} = require("./users.controller");

router.post("/sign_up", create_user);
router.get("/", get_all_users);
router.get("/search", search_for_user);
router.get("/:id", get_user_by_id);

module.exports = router;
