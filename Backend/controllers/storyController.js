const User = require("../models/User");
const Story = require("../models/Story");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const createStory = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) {
		return res.status(401).json({ message: "Invalid Request" });
	}
	const user_id = decoded._id;
	const user = await User.findById(user_id).lean().exec();

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	let { title, cover_image, access_level, points_required, allow_copy } =
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
	};

	if (access_level === "paid") {
		storyData.points_required = points_required;
	}
	const story = await Story.create(storyData);

	const baseDirectory = path.join(__dirname, "..", "filesystem");
	const userDirectory = path.join(baseDirectory, user_id.toString());
	const storyDirectory = path.join(userDirectory, "story");
	const specificStoryDirectory = path.join(
		storyDirectory,
		story._id.toString()
	);

	if (!fs.existsSync(baseDirectory)) {
		fs.mkdirSync(baseDirectory, { recursive: true });
	}
	if (!fs.existsSync(userDirectory)) {
		fs.mkdirSync(userDirectory, { recursive: true });
	}

	if (!fs.existsSync(storyDirectory)) {
		fs.mkdirSync(storyDirectory, { recursive: true });
	}
	if (!fs.existsSync(specificStoryDirectory)) {
		fs.mkdirSync(specificStoryDirectory, { recursive: true });
	}

	const filePath = path.join(specificStoryDirectory, "cover_image.txt");
	fs.writeFileSync(filePath, cover_image);

	await Story.findByIdAndUpdate(story._id, { cover_image: filePath }).exec();

	return res
		.status(201)
		.json({ message: "Story created", story_id: story._id });
});

const getStory = asyncHandler(async (req, res) => {
	let story_id = req.body.story_id;
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
	return res.status(200).json({ story });
});

const saveChanges = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	let { story, story_id } = req.body;

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

	if (!story) {
		return res.status(400).json({ message: "Story is required" });
	}

	let pages = story.pages;
	let current_story = await Story.findById(story_id).exec();
	current_story.pages = pages;
	let updated_story = await current_story.save();
	return res.status(200).json({ updated_story });
});

module.exports = {
	createStory,
	getStory,
	saveChanges,
};
