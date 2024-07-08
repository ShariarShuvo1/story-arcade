const User = require("../models/User");
const Story = require("../models/Story");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createStory = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	if (!decoded) {
		return res.status(401).json({ message: "Invalid Request" });
	}
	const user_id = decoded._id;
	const user = await User.findById(user_id).lean().exec();
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
});

module.exports = {
	createStory,
};
