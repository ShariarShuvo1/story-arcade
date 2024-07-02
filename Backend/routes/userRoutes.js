const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/createNewUser").post(usersController.createNewUser);

router.route("/loginUser").post(usersController.loginUser);

module.exports = router;
