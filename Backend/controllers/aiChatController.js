const User = require("../models/User");
const Story = require("../models/Story");
const Page = require("../models/Page");
const AiChat = require("../models/AiChat");
const StoryAccess = require("../models/StoryAccess");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const getPreviousChats = asyncHandler(async (req, res) => {
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

	const story_user = await Story.findById(story_id, { uploader: 1, title: 1 })
		.lean()
		.exec();

	if (!story_user) {
		return res.status(404).json({ message: "Story not found" });
	}

	if (story_user.uploader.toString() !== user_id) {
		return res.status(403).json({ message: "Forbidden" });
	}

	let chats = await AiChat.findOne({ story: story_id }).lean().exec();

	if (!chats) {
		chats = await AiChat.create({ story: story_id, chats: [] });
	}
	return res.status(200).json({ chats: chats.chats });
});

const clearAiChat = asyncHandler(async (req, res) => {
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

	const story_user = await Story.findById(story_id, { uploader: 1, title: 1 })
		.lean()
		.exec();

	if (!story_user) {
		return res.status(404).json({ message: "Story not found" });
	}

	if (story_user.uploader.toString() !== user_id) {
		return res.status(403).json({ message: "Forbidden" });
	}

	let chats = await AiChat.findOne({ story: story_id }).lean().exec();

	if (chats) {
		chats = await AiChat.findOneAndUpdate(
			{ story: story_id },
			{ chats: [] },
			{ new: true }
		)
			.lean()
			.exec();
	}
	return res.status(200).json({ chats: chats.chats });
});

module.exports = {
	getPreviousChats,
	clearAiChat,
};
