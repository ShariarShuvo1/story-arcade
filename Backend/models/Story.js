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
		required: true,
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
	pages: [
		{
			page_number: {
				type: Number,
				required: true,
			},
			page_story: {
				type: String,
				required: false,
			},
			background_image: {
				type: String,
				required: true,
			},
			steps: [
				{
					step_number: {
						type: Number,
						required: true,
					},
					step_type: {
						type: String,
						enum: ["choice", "task"],
						required: true,
					},
				},
			],
			choices: [
				{
					choice_number: {
						type: Number,
						required: true,
					},
					choice: {
						type: String,
						required: true,
					},
					next_page: {
						type: Number,
						required: true,
					},
				},
			],
			tasks: [
				{
					task_number: {
						type: Number,
						required: true,
					},
					task: {
						type: String,
						enum: ["center_button", "slider"],
						required: true,
					},
					center_button: {
						type: String,
						default: "click",
						required: false,
					},
					slider: {
						type: String,
						enum: ["left", "right"],
						default: "left",
						required: false,
					},
				},
			],
		},
	],
});

module.exports = mongoose.model("Story", storySchema);
