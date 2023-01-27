const router = require("express").Router();

const { getUsers, createUser, getSingleUser, deleteUser, updateUser } = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/:userId").get(getSingleUser);
router.route("/:userId").delete(deleteUser).put(updateUser);

module.exports = router;
