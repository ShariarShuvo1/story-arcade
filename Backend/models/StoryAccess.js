const mongoose = require("mongoose");

const storyAccessSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	story: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story",
		required: true,
	},
	purchase_time: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

module.exports = mongoose.model("StoryAccess", storyAccessSchema);
