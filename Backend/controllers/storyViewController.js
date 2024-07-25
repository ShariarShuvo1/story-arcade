const User = require("../models/User");
const Story = require("../models/Story");
const Page = require("../models/Page");
const StoryAccess = require("../models/StoryAccess");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const getInitialPages = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

	const story_user = await StoryAccess.findOne({
		user: user_id,
		story: story_id,
	}).lean();

	if (!story_user) {
		return res
			.status(404)
			.json({ message: "You do not have access to this story" });
	}

	let pages = [];

	let initial_pages = await Page.findOne({
		story: story_id,
		is_starting_page: true,
	})
		.lean()
		.exec();

	if (!initial_pages) {
		return res.status(404).json({ message: "No pages found" });
	}

	pages.push(initial_pages);

	let initial_steps = initial_pages.steps;
	let page_found = false;
	for (let i = 0; i < initial_steps.length; i++) {
		let step = initial_steps[i];
		if (
			step.next_type === "page" &&
			step.step_type !== "choice" &&
			!page_found
		) {
			let next_page = await Page.findById(step.next_page).lean().exec();
			console.log(next_page);
			if (next_page) {
				pages.push(next_page);
				page_found = true;
			}
		}
		if (step.step_type === "choice") {
			let next_page = await Page.findById(step.next_page).lean().exec();
			if (next_page) {
				pages.push(next_page);
			}
		}
	}

	return res.status(200).json({ pages: pages });
});

const getNextPages = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	let { story_id, child_pages } = req.body;

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

	const story_user = await StoryAccess.findOne({
		user: user_id,
		story: story_id,
	}).lean();

	if (!story_user) {
		return res
			.status(404)
			.json({ message: "You do not have access to this story" });
	}

	let pages = [];

	for (let run = 0; run < child_pages.length; run++) {
		let page_number = child_pages[run];
		let page = await Page.findOne({
			story: story_id,
			page_number: page_number,
		})
			.lean()
			.exec();

		let initial_steps = page.steps;
		let page_found = false;
		for (let i = 0; i < initial_steps.length; i++) {
			let step = initial_steps[i];
			if (
				step.next_type === "page" &&
				step.step_type !== "choice" &&
				!page_found
			) {
				let next_page = await Page.findById(step.next_page)
					.lean()
					.exec();
				console.log(next_page);
				if (next_page) {
					pages.push(next_page);
					page_found = true;
				}
			}
			if (step.step_type === "choice") {
				let next_page = await Page.findById(step.next_page)
					.lean()
					.exec();
				if (next_page) {
					pages.push(next_page);
				}
			}
		}
	}

	return res.status(200).json({ pages: pages });
});

module.exports = {
	getInitialPages,
	getNextPages,
};
