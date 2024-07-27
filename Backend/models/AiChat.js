const mongoose = require("mongoose");

const aiChatSchema = new mongoose.Schema({
	story: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story",
		required: true,
		unique: true,
	},
	chats: [
		{
			created_at: {
				type: Date,
				default: Date.now,
				required: true,
			},
			text: {
				type: String,
				required: true,
			},
			sender: {
				type: String,
				enum: ["user", "ai"],
				required: true,
			},
		},
	],
});

module.exports = mongoose.model("AiChat", aiChatSchema);
