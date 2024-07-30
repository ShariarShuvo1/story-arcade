const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
	voter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	story: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story",
		required: true,
	},
	vote_time: {
		type: Date,
		default: Date.now,
		required: true,
	},
	vote_type: {
		type: String,
		enum: ["upvote", "downvote"],
		required: true,
	},
});

module.exports = mongoose.model("Vote", voteSchema);
