const mongoose = require("mongoose");

const upvoteSchema = new mongoose.Schema({
	upvoter: {
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
});

module.exports = mongoose.model("Upvote", upvoteSchema);