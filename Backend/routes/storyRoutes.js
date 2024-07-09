const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.post("/create", storyController.createStory);
router.post("/getStory", storyController.getStory);
router.post("/saveChanges", storyController.saveChanges);

module.exports = router;
