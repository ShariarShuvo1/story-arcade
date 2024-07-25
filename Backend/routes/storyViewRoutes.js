const express = require("express");
const router = express.Router();
const storyViewController = require("../controllers/storyViewController");

router.post("/getInitialPages", storyViewController.getInitialPages);
router.post("/getNextPages", storyViewController.getNextPages);

module.exports = router;
