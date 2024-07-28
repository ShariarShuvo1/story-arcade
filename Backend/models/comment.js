const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	commenter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	story: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story",
		required: true,
	},
	comment_time: {
		type: Date,
		default: Date.now,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
});
