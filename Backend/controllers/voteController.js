const mongoose = require("mongoose");
const User = require("../models/User");
const Story = require("../models/Story");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const StoryAccess = require("../models/StoryAccess");
const Follow = require("../models/Follow");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const voteHandle = asyncHandler(async (req, res) => {
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
	if (!story) {
		return res.status(404).json({ message: "Story not found" });
	}
	const vote_type = req.body.voteType;

    // check if vote already exists

    const vote = await Vote.findOne({ voter: user_id, story: story_id }).lean().exec();

    if(vote){
        return res.status(400).json({ message: "Vote already exists" });
    }

	if (vote_type === "upvote") {
		const vote = await Vote.create({
			voter: user_id,
			story: story_id,
			vote_type: "upvote",
		});
	} else if (vote_type === "downvote") {
		const vote = await Vote.create({
			voter: user_id,
			story: story_id,
			vote_type: "downvote",
		});
	} else {
		return res.status(400).json({ message: "Invalid vote type" });
	}

	return res.status(200).json({ message: "Vote successful" });
});

module.exports = {
	voteHandle,
};
