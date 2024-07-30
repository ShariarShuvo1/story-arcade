const mongoose = require("mongoose");
const User = require("../models/User");
const Story = require("../models/Story");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const StoryAccess = require("../models/StoryAccess");
const Follow = require("../models/Follow");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const getInitialPopular = asyncHandler(async (req, res) => {
	try {
		const stories = await Story.aggregate([
			{
				$match: { access_level: { $ne: "private" } },
			},
			{
				$lookup: {
					from: "users",
					localField: "uploader",
					foreignField: "_id",
					as: "uploader_info",
				},
			},
			{
				$unwind: "$uploader_info",
			},
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "story",
					as: "comments",
				},
			},
			{
				$lookup: {
					from: "votes",
					localField: "_id",
					foreignField: "story",
					as: "votes",
				},
			},
			{
				$lookup: {
					from: "storyaccesses",
					localField: "_id",
					foreignField: "story",
					as: "accesses",
				},
			},
			{
				$addFields: {
					upvote_count: {
						$size: {
							$filter: {
								input: "$votes",
								as: "vote",
								cond: { $eq: ["$$vote.vote_type", "upvote"] },
							},
						},
					},
					downvote_count: {
						$size: {
							$filter: {
								input: "$votes",
								as: "vote",
								cond: { $eq: ["$$vote.vote_type", "downvote"] },
							},
						},
					},
					comment_count: { $size: "$comments" },
					access_count: { $size: "$accesses" },
				},
			},
			{
				$project: {
					_id: 1,
					uploader: 1,
					access_level: 1,
					points_required: 1,
					allow_copy: 1,
					cover_image: 1,
					original_uploader: 1,
					original_story: 1,
					created_at: 1,
					title: 1,
					tags: 1,
					"uploader_info.name": 1,
					"uploader_info.avatar": 1,
					upvote_count: { $ifNull: ["$upvote_count", 0] },
					downvote_count: { $ifNull: ["$downvote_count", 0] },
					comment_count: { $ifNull: ["$comment_count", 0] },
				},
			},
			{
				$sort: {
					access_count: -1,
					upvote_count: -1,
					comment_count: -1,
					created_at: -1,
				},
			},
			{
				$limit: 8,
			},
		]);

		res.status(200).json({ stories: stories });
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
});

const getNextPopular = asyncHandler(async (req, res) => {
	try {
		const listOfStoryIds = req.body.storyIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);
		const stories = await Story.aggregate([
			{
				$match: {
					access_level: { $ne: "private" },
					_id: { $nin: listOfStoryIds },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "uploader",
					foreignField: "_id",
					as: "uploader_info",
				},
			},
			{
				$unwind: "$uploader_info",
			},
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "story",
					as: "comments",
				},
			},
			{
				$lookup: {
					from: "votes",
					localField: "_id",
					foreignField: "story",
					as: "votes",
				},
			},
			{
				$lookup: {
					from: "storyaccesses",
					localField: "_id",
					foreignField: "story",
					as: "accesses",
				},
			},
			{
				$addFields: {
					upvote_count: {
						$size: {
							$filter: {
								input: "$votes",
								as: "vote",
								cond: { $eq: ["$$vote.vote_type", "upvote"] },
							},
						},
					},
					downvote_count: {
						$size: {
							$filter: {
								input: "$votes",
								as: "vote",
								cond: { $eq: ["$$vote.vote_type", "downvote"] },
							},
						},
					},
					comment_count: { $size: "$comments" },
					access_count: { $size: "$accesses" },
				},
			},
			{
				$project: {
					_id: 1,
					uploader: 1,
					access_level: 1,
					points_required: 1,
					allow_copy: 1,
					cover_image: 1,
					original_uploader: 1,
					original_story: 1,
					created_at: 1,
					title: 1,
					tags: 1,
					"uploader_info.name": 1,
					"uploader_info.avatar": 1,
					upvote_count: { $ifNull: ["$upvote_count", 0] },
					downvote_count: { $ifNull: ["$downvote_count", 0] },
					comment_count: { $ifNull: ["$comment_count", 0] },
				},
			},
			{
				$sort: {
					access_count: -1,
					upvote_count: -1,
					comment_count: -1,
					created_at: -1,
				},
			},
			{
				$limit: 8,
			},
		]);

		res.status(200).json({ stories: stories });
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
});

const getStoryAccess = asyncHandler(async (req, res) => {
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
	const story_id = req.body.storyId;
	const story = await StoryAccess.findOne({ story: story_id, user: user_id })
		.lean()
		.exec();

	if (!story) {
		return res.status(404).json({ story_access: false });
	}
	res.status(200).json({ story_access: true });
});

const provideFreeAccess = asyncHandler(async (req, res) => {
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
	const story_id = req.body.storyId;
	const story = await Story.findById(story_id).lean().exec();
	if (story && story.access_level === "public") {
		await StoryAccess.create({
			user: user_id,
			story: story_id,
		});
	} else {
		return res.status(400).json({ message: "Story is not Accessible" });
	}

	res.status(200).json({ story_access: true });
});

const provideFollowerAccess = asyncHandler(async (req, res) => {
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
	const story_id = req.body.storyId;
	const story = await Story.findById(story_id).lean().exec();

	const follow = await Follow.findOne({
		follow: story.uploader,
		follower: user_id,
	})
		.lean()
		.exec();

	if (!follow) {
		return res.status(400).json({
			message: "You need to follow the author to access this story",
		});
	}

	if (story && story.access_level === "followers_only" && follow) {
		await StoryAccess.create({
			user: user_id,
			story: story_id,
		});
	} else {
		return res.status(400).json({ message: "Story is not Accessible" });
	}

	res.status(200).json({ story_access: true });
});

module.exports = {
	getInitialPopular,
	getNextPopular,
	getStoryAccess,
	provideFreeAccess,
	provideFollowerAccess,
};
