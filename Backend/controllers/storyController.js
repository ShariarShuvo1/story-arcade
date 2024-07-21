const User = require("../models/User");
const Story = require("../models/Story");
const Page = require("../models/Page");
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
		cover_image: cover_image,
	};

	if (access_level === "paid") {
		storyData.points_required = points_required;
	}
	const story = await Story.create(storyData);

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

const getPage = asyncHandler(async (req, res) => {
	let story_id = req.body.story_id;
	let page_number = req.body.page_number;
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
	});
});

const saveAPage = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

	const story_user = await Story.findById(story_id, "uploader").lean().exec();

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

	return res
		.status(200)
		.json({ page: current_page, story: list_of_page_numbers });
});

module.exports = {
	createStory,
	getStory,
	getPage,
	saveAPage,
};
