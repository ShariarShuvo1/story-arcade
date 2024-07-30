const express = require("express");
const router = express.Router();
const homepageStoryController = require("../controllers/homepageStoryController");

router
	.route("/getInitialPopular")
	.get(homepageStoryController.getInitialPopular);

router.route("/getNextPopular").post(homepageStoryController.getNextPopular);

router.route("/getStoryAccess").post(homepageStoryController.getStoryAccess);

router
	.route("/provideFreeAccess")
	.post(homepageStoryController.provideFreeAccess);

router
	.route("/provideFollowerAccess")
	.post(homepageStoryController.provideFollowerAccess);

module.exports = router;
