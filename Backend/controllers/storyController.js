const User = require("../models/User");
const Story = require("../models/Story");
const Page = require("../models/Page");
const StoryAccess = require("../models/StoryAccess");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const AiChat = require("../models/AiChat");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createStory = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let { title, cover_image, access_level, points_required, allow_copy, tags } =
    req.body;

  if (access_level === "paid") {
    if (!points_required) {
      return res.status(400).json({ message: "Points required" });
    }
  }

  if (!title || !cover_image || !access_level) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (access_level === "followers only") {
    access_level = "followers_only";
  }

  const storyData = {
    uploader: user_id,
    title,
    access_level,
    allow_copy,
    cover_image: cover_image,
    tags,
  };

  if (access_level === "paid") {
    storyData.points_required = points_required;
  }
  const story = await Story.create(storyData);

  await StoryAccess.create({
    user: user_id,
    story: story._id,
  });

  return res
    .status(201)
    .json({ message: "Story created", story_id: story._id });
});

const updateStory = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let {
    title,
    cover_image,
    access_level,
    points_required,
    allow_copy,
    tags,
    story_id,
  } = req.body;

  if (access_level === "paid") {
    if (!points_required) {
      return res.status(400).json({ message: "Points required" });
    }
  }

  if (!title || !cover_image || !access_level) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (access_level === "followers only") {
    access_level = "followers_only";
  }

  const storyData = {
    uploader: user_id,
    title,
    access_level,
    allow_copy,
    cover_image: cover_image,
    tags,
  };

  if (access_level === "paid") {
    storyData.points_required = points_required;
  }
  const story = await Story.findByIdAndUpdate(story_id, storyData, {
    new: true,
  });

  return res
    .status(201)
    .json({ message: "Story created", story_id: story._id });
});

const getStory = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  const token = req.headers.authorization.split(" ")[1];

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, "uploader").lean().exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const story = await Story.findById(story_id).lean().exec();
  return res.status(200).json({ story: story });
});

const getPage = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  let page_number = req.body.page_number;
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, { uploader: 1, title: 1 })
    .lean()
    .exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let page = null;
  if (page_number) {
    page = await Page.findOne({ story: story_id, page_number }).lean().exec();
  } else {
    page = await Page.findOne({ story: story_id, is_starting_page: true })
      .lean()
      .exec();
  }

  const list_of_page_numbers_from_db = await Page.find(
    { story: story_id },
    "page_number"
  )
    .lean()
    .exec();

  let list_of_page_numbers = [];
  list_of_page_numbers_from_db.forEach((page) => {
    list_of_page_numbers.push(page.page_number);
  });

  return res.status(200).json({
    page: page,
    story: list_of_page_numbers,
    story_title: story_user.title,
  });
});

const saveAPage = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  let { page, story_id } = req.body;

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, { uploader: 1, title: 1 })
    .lean()
    .exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (!page) {
    return res.status(400).json({ message: "Story is required" });
  }

  let current_page = await Page.findOne({
    story: story_id,
    page_number: page.page_number,
  })
    .lean()
    .exec();

  if (!current_page) {
    page.story = story_id;
    current_page = await Page.create(page);
  } else {
    current_page = page;
    current_page.story = story_id;
    current_page = await Page.findByIdAndUpdate(
      current_page._id,
      current_page,
      { new: true }
    );
  }

  const list_of_page_numbers_from_db = await Page.find(
    { story: story_id },
    "page_number"
  )
    .lean()
    .exec();

  let list_of_page_numbers = [];
  list_of_page_numbers_from_db.forEach((page) => {
    list_of_page_numbers.push(page.page_number);
  });

  return res.status(200).json({
    page: current_page,
    story: list_of_page_numbers,
    story_title: story_user.title,
  });
});

const getPageList = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  let { page_number, story_id } = req.body;

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, "uploader").lean().exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (!page_number) {
    return res.status(400).json({ message: "Current Page Number is required" });
  }

  const list_of_page_numbers_from_db = await Page.find(
    { story: story_id },
    "page_number"
  )
    .lean()
    .exec();

  let list_of_page_numbers = [];
  list_of_page_numbers_from_db.forEach((page) => {
    if (page.page_number !== page_number) {
      list_of_page_numbers.push({
        page_number: page.page_number,
        id: page._id,
      });
    }
  });

  return res.status(200).json(list_of_page_numbers);
});

const initialPageDeleteCheck = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  let page_number = req.body.page_number;
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, { uploader: 1, title: 1 })
    .lean()
    .exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let tempPage = null;

  tempPage = await Page.findOne({ story: story_id, page_number }).lean().exec();
  if (!tempPage) {
    return res.status(404).json({ message: "Page not found" });
  }

  const tempPageId = new mongoose.Types.ObjectId(tempPage._id);

  let conflicts = await Page.aggregate([
    { $match: { story: new mongoose.Types.ObjectId(story_id) } },
    { $unwind: "$steps" },
    {
      $match: {
        "steps.next_type": "page",
        "steps.next_page": tempPageId,
      },
    },
    {
      $project: {
        _id: 0,
        page_number: 1,
        step_number: "$steps.step_number",
        step_name: "$steps.step_name",
        step_type: "$steps.step_type",
      },
    },
  ]).exec();

  return res.status(200).json({ conflicts: conflicts });
});

const pageDelete = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  let page_number = req.body.page_number;
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, { uploader: 1, title: 1 })
    .lean()
    .exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let tempPage = null;

  tempPage = await Page.findOne({ story: story_id, page_number }).lean().exec();
  if (!tempPage) {
    return res.status(404).json({ message: "Page not found" });
  }

  const tempPageId = new mongoose.Types.ObjectId(tempPage._id);

  let conflicts = await Page.aggregate([
    { $match: { story: new mongoose.Types.ObjectId(story_id) } },
    { $unwind: "$steps" },
    {
      $match: {
        "steps.next_type": "page",
        "steps.next_page": tempPageId,
      },
    },
    {
      $project: {
        _id: 0,
        page_id: "$_id",
        step_id: "$steps._id",
        step_number: "$steps.step_number",
        step_name: "$steps.step_name",
        step_type: "$steps.step_type",
      },
    },
  ]).exec();

  if (conflicts.length > 0) {
    for (let conflict of conflicts) {
      await Page.updateOne(
        { _id: conflict.page_id },
        { $pull: { steps: { _id: conflict.step_id } } }
      ).exec();
    }
  }

  await Page.deleteOne({ _id: tempPageId }).exec();

  const list_of_page_numbers_from_db = await Page.find(
    { story: story_id },
    "page_number"
  )
    .lean()
    .exec();

  let list_of_page_numbers = [];
  list_of_page_numbers_from_db.forEach((page) => {
    list_of_page_numbers.push(page.page_number);
  });

  return res.status(200).json({
    message: "Page deleted successfully",
    story: list_of_page_numbers,
  });
});

const buyStory = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  let { story_id } = req.body;

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story = await Story.findById(story_id).lean().exec();
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (story.access_level !== "paid") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const story_price = story.points_required;
  const author = await User.findById(story.uploader).lean().exec();

  if (user.points_left < story_price) {
    return res.status(400).json({ message: "Insufficient points" });
  }

  await User.updateOne(
    { _id: user_id },
    { $inc: { points_left: -story_price } }
  ).exec();

  await User.updateOne(
    { _id: author._id },
    { $inc: { points_left: story_price } }
  ).exec();

  await StoryAccess.create({
    user: user_id,
    story: story_id,
  });

  return res.status(200).json({ message: "Story bought successfully" });
});

const deleteStory = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  const token = req.headers.authorization.split(" ")[1];

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story_user = await Story.findById(story_id, "uploader").lean().exec();

  if (!story_user) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (story_user.uploader.toString() !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const story = await Story.findById(story_id).lean().exec();

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  await Page.deleteMany({ story: story_id }).exec();
  await StoryAccess.deleteMany({ story: story_id }).exec();
  await Comment.deleteMany({ story: story_id }).exec();
  await Vote.deleteMany({ story: story_id }).exec();
  await AiChat.deleteOne({ story: story_id }).exec();
  await Story.deleteOne({ _id: story }).exec();

  return res.status(200).json({ message: "Story deleted successfully" });
});

const cloneStory = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  const token = req.headers.authorization.split(" ")[1];

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story = await Story.findById(story_id).lean().exec();

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (!story.allow_copy) {
    return res.status(400).json({ message: "Story cannot be cloned" });
  }

  const access = await StoryAccess.findOne({ user: user_id, story: story_id })
    .lean()
    .exec();

  if (!access) {
    return res.status(403).json({ message: "You do not have access" });
  }

  const newStory = {
    uploader: user_id,
    title: story.title,
    access_level: story.access_level,
    allow_copy: story.allow_copy,
    cover_image: story.cover_image,
    tags: story.tags,
    points_required: story.points_required,
    original_uploader: story.uploader,
    original_story: story_id,
  };

  const clonedStory = await Story.create(newStory);

  await StoryAccess.create({
    user: user_id,
    story: clonedStory._id,
  });

  const pages = await Page.find({
    story: story_id,
  })
    .lean()
    .exec();

  for (let page of pages) {
    const newPage = {
      story: clonedStory._id,
      page_number: page.page_number,
      is_starting_page: page.is_starting_page,
      steps: page.steps,
      background_image: page.background_image,
      mover: page.mover,
      page_story: page.page_story,
      choices: page.choices,
      tasks: page.tasks,
    };
    await Page.create(newPage);
  }

  return res.status(200).json({
    message: "Story cloned successfully",
    story_id: clonedStory._id,
  });
});

const storyExist = asyncHandler(async (req, res) => {
  let story_id = req.body.story_id;
  const token = req.headers.authorization.split(" ")[1];

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  if (!story_id) {
    return res.status(400).json({ message: "Story ID is required" });
  }

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }

  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const story = await Story.findById(story_id).lean().exec();

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  return res.status(200).json({ message: true });
});

const getAllStories = asyncHandler(async (req, res) => {
  Story.find()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

const adminDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  Story.findByIdAndDelete({ _id: id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

const getTotalStories = asyncHandler(async (req, res) => {
  try {
    const totalStories = await Story.countDocuments();
    res.status(200).json({ totalStories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const getStoryViewsOverTime = asyncHandler(async (req, res) => {
  try {
    const storyViews = await StoryAccess.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchase_time" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(storyViews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching story views data", error });
  }
});

module.exports = {
  createStory,
  getStory,
  getPage,
  saveAPage,
  getPageList,
  initialPageDeleteCheck,
  pageDelete,
  buyStory,
  updateStory,
  deleteStory,
  cloneStory,
  storyExist,
  getAllStories,
  adminDelete,
  getTotalStories,
  getStoryViewsOverTime,
};
