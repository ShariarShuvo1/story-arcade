const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password required" });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: "Invalid email" });
	}

	const user = await User.findOne({ email })
		.select("+password")
		.lean()
		.exec();

	if (!user) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const token = createToken(user._id);
	res.json({ token, message: "User logged in" });
});

const createNewUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: "Invalid email" });
	}

	// if (!validator.isStrongPassword(password)) {
	//     return res.status(400).json({ message: "Password is not strong enough" });
	// }

	const duplicate = await User.findOne({ email }).lean().exec();

	if (duplicate) {
		return res.status(409).json({ message: "Duplicate email" });
	}

	const hashedPwd = await bcrypt.hash(password, 10);

	const userObject = { email, password: hashedPwd };

	const user = await User.create(userObject);

	if (user) {
		const token = createToken(user._id);

		res.status(201).json({ token, message: "User created" });
	} else {
		res.status(400).json({ message: "Invalid user data received" });
	}
});

module.exports = {
	loginUser,
	createNewUser,
};
