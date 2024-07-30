const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

router.route("/voteHandle").post(voteController.voteHandle);


module.exports = router;
