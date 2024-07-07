const mongoose = require("mongoose");

const downvoteSchema = new mongoose.Schema({
	downvoter: {
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

module.exports = mongoose.model("Downvote", downvoteSchema);