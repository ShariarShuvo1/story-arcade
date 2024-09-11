const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.post("/create", storyController.createStory);
router.post("/updateStory", storyController.updateStory);
router.post("/getStory", storyController.getStory);
router.post("/getPage", storyController.getPage);
router.post("/saveAPage", storyController.saveAPage);
router.post("/getPageList", storyController.getPageList);
router.post("/initialPageDeleteCheck", storyController.initialPageDeleteCheck);
router.post("/pageDelete", storyController.pageDelete);
router.post("/buyStory", storyController.buyStory);
router.post("/deleteStory", storyController.deleteStory);
router.post("/cloneStory", storyController.cloneStory);
router.post("/storyExist", storyController.storyExist);
router.get("/getAllStories", storyController.getAllStories);
router.delete("/adminDelete/:id", storyController.adminDelete);
router.get("/getTotalStories", storyController.getTotalStories);
router.get("/getStoryViewsOverTime", storyController.getStoryViewsOverTime);

module.exports = router;
