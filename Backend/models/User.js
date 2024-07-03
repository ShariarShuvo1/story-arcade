const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	dob: {
		type: Date,
		required: true,
	},
	email_verified: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	avatar: {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	banned: {
		type: Boolean,
		default: false,
	},
	ban_start_date: {
		type: Date,
	},
	ban_end_date: {
		type: Date,
	},
	last_otps: [
		{
			otp: {
				type: String,
				length: 6,
				required: true,
			},
			created_at: {
				type: Date,
				default: Date.now,
			},
			used: {
				type: Boolean,
				default: false,
			},
			duration: {
				type: Number,
				default: 5, //Minutes
			},
		},
	],
});

module.exports = mongoose.model("User", userSchema);
