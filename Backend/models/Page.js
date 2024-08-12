const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
	story: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story",
		required: true,
	},
	page_number: {
		type: Number,
		required: true,
	},
	is_starting_page: {
		type: Boolean,
		required: false,
	},
	background_image: {
		type: String,
		required: false,
	},
	background_video: {
		type: String,
		required: false,
	},
	steps: [
		{
			step_number: {
				type: Number,
				required: true,
			},
			step_name: {
				type: String,
				required: false,
			},
			step_type: {
				type: String,
				enum: ["choice", "task", "story", "mover", "game"],
				required: true,
			},
			child_step_number: {
				type: Number,
				required: false,
			},
			next_type: {
				type: String,
				enum: ["step", "page"],
				required: true,
			},
			next_page: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Page",
				required: false,
			},
		},
	],
	mover: [
		{
			mover_number: {
				type: Number,
				required: true,
			},
			wait_duration: {
				type: Number,
				default: 0,
				required: true,
			},
			next_type: {
				type: String,
				enum: ["click", "auto"],
				default: "auto",
				required: true,
			},
		},
	],
	page_story: [
		{
			page_story_number: {
				type: Number,
				required: true,
			},
			story_text: {
				type: String,
				required: false,
			},
		},
	],
	games: [
		{
			game_number: {
				type: Number,
				required: true,
			},
			html: {
				type: String,
				required: false,
			},
			css: {
				type: String,
				required: false,
			},
			js: {
				type: String,
				required: false,
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
				required: false,
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
				enum: ["button", "slider"],
				required: true,
			},
			button: {
				type: String,
				required: false,
			},
			button_color: {
				type: String,
				required: false,
			},
			button_text_color: {
				type: String,
				required: false,
			},
			button_border_color: {
				type: String,
				required: false,
			},
			slider: {
				type: String,
				required: false,
			},
		},
	],
});

module.exports = mongoose.model("Page", pageSchema);
