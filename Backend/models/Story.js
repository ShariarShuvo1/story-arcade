const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
	uploader: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	access_level: {
		type: String,
		enum: ["public", "private", "followers_only", "paid"],
		default: "public",
		required: true,
	},
	points_required: {
		type: Number,
		required: false,
	},
	allow_copy: {
		type: Boolean,
		default: true,
		required: false,
	},
	cover_image: {
		type: String,
		required: false,
	},
	original_uploader: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: false,
	},
	original_story: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story",
		required: false,
	},
	created_at: {
		type: Date,
		default: Date.now,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Story", storySchema);
