const express = require("express");
const router = express.Router();
const emailVerificationController = require("../../controllers/functions/emailVerificationController");

router
	.route("/verifyEmailOTP")
	.post(emailVerificationController.verifyEmailOTP);

module.exports = router;
