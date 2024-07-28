const express = require("express");
const router = express.Router();
const aiChatConroller = require("../controllers/aiChatController");

router.post("/getPreviousChats", aiChatConroller.getPreviousChats);
router.post("/clearAiChat", aiChatConroller.clearAiChat);

module.exports = router;
