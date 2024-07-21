const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.post("/create", storyController.createStory);
router.post("/getStory", storyController.getStory);
router.post("/getPage", storyController.getPage);
router.post("/saveAPage", storyController.saveAPage);

module.exports = router;
