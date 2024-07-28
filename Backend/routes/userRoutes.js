const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/createNewUser").post(usersController.createNewUser);

router.route("/loginUser").post(usersController.loginUser);

router.route("/getPointsLeft").get(usersController.getPointsLeft);

router.route("/getName").get(usersController.getName);

module.exports = router;
