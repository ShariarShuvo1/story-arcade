const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
	follow: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	follower: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	follow_time: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

module.exports = mongoose.model("Follow", followSchema);
