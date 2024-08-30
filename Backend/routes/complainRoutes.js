const express = require("express");
const router = express.Router();
const complainControler = require("../controllers/complainController");

router.route("/getComplain").get(complainControler.getComplain);
router.route("/updateComplain/:id").put(complainControler.updateComplain);
router.route("/deleteComplain/:id").delete(complainControler.deleteComplain);
router.route("/addComplain").post(complainControler.addComplain);

module.exports = router;
