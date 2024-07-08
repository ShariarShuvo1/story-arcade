const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.post("/create", storyController.createStory);

module.exports = router;
