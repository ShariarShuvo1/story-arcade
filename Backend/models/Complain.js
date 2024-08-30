const mongoose = require("mongoose");

const ComplainSchema = new mongoose.Schema({
	prob: String,
	done: {
		type: Boolean,
		default: false,
	},
});

const ComplainModel = mongoose.model("complains", ComplainSchema);
module.exports = ComplainModel;
