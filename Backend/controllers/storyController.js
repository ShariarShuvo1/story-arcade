const User = require("../models/User");
const Story = require("../models/Story");
const Page = require("../models/Page");
const StoryAccess = require("../models/StoryAccess");
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
		cover_image: cover_image,
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
	return res.status(200).json({ story });
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
		page = await Page.findOne({ story: story_id, page_number })
			.lean()
			.exec();
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
		return res
			.status(400)
			.json({ message: "Current Page Number is required" });
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

	tempPage = await Page.findOne({ story: story_id, page_number })
		.lean()
		.exec();
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

	tempPage = await Page.findOne({ story: story_id, page_number })
		.lean()
		.exec();
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

module.exports = {
	createStory,
	getStory,
	getPage,
	saveAPage,
	getPageList,
	initialPageDeleteCheck,
	pageDelete,
};
