const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { sendOtp } = require("./functions/emailVerification");

const createToken = (_id, role) => {
	return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

function minimumAgeValidator(dob, minAge) {
	const today = new Date();
	const age = new Date(
		today.getFullYear() - minAge,
		today.getMonth(),
		today.getDate()
	);

	if (typeof dob === "string") {
		dob = new Date(dob);
	}

	return dob <= age;
}

function isValidDOB(dob) {
	if (typeof dob === "string") {
		dob = new Date(dob);
	}
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return dob <= today;
}

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
	return res.json({ token, message: "User logged in" });
});

const createNewUser = asyncHandler(async (req, res) => {
	const { email, password, dob, name } = req.body;

	if (!email || !password || !name || !dob) {
		return res.status(400).json({ message: "All fields are required" });
	}

	if (!validator.isEmail(email)) {
		return res
			.status(400)
			.json({ message: "Invalid email, please use a valid email" });
	}

	if (!validator.isDate(dob) || !isValidDOB(dob)) {
		return res.status(400).json({ message: "Invalid date of birth" });
	}

	if (!minimumAgeValidator(dob, 10)) {
		return res
			.status(400)
			.json({ message: "You must be at least 10 years old" });
	}

	const duplicate = await User.findOne({ email }).lean().exec();

	if (duplicate) {
		return res
			.status(409)
			.json({ message: "Duplicate email, please use another email" });
	}

	const hashedPwd = await bcrypt.hash(password, 10);

	const userObject = {
		email,
		password: hashedPwd,
		name,
		dob,
	};

	const user = await User.create(userObject);

	if (user) {
		const token = createToken(user._id, user.role);
		sendOtp(email);
		return res.status(201).json({ token, message: "User created" });
	} else {
		return res.status(400).json({ message: "Invalid user data received" });
	}
});

module.exports = {
	loginUser,
	createNewUser,
};
