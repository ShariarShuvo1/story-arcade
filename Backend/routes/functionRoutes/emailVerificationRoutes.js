const express = require("express");
const router = express.Router();
const emailVerificationController = require("../../controllers/functions/emailVerificationController");

router
	.route("/verifyEmailOTP")
	.post(emailVerificationController.verifyEmailOTP);

router
	.route("/checkUserExist")
	.post(emailVerificationController.checkUserExist);

router
	.route("/forgetPasswordOtp")
	.post(emailVerificationController.forgetPasswordOtp);

module.exports = router;
