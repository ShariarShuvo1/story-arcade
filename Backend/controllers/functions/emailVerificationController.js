const nodemailer = require("nodemailer");
const User = require("../../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.GMAIL,
		pass: process.env.GMAIL_PASS,
	},
});

function generateOTP() {
	let otp = "";
	for (let i = 0; i < 6; i++) {
		otp += Math.floor(Math.random() * 10);
	}
	return otp;
}

async function deleteExpiredOTPsOfUser(user) {
	const now = new Date();
	const updatedOTPs = user.last_otps.filter((otp) => {
		const otpCreatedAt = new Date(otp.created_at);
		const otpExpirationTime = new Date(
			otpCreatedAt.getTime() + otp.duration * 60000
		);

		return !otp.used && now <= otpExpirationTime;
	});

	user.last_otps = updatedOTPs;
	await user.save();
}

async function sendOtp(email, name) {
	const otp = generateOTP();

	const mailOptions = {
		from: process.env.GMAIL,
		to: email,
		subject:
			"[StoryArcade] Your One-Time Password (OTP) for Email Verification",
		text: `Dear ${name},

Thank you for signing up for StoryArcade! To complete your email verification, please use the One-Time Password (OTP) provided below:

Your OTP: ${otp}

This OTP is valid for the next 5 minutes. Please enter this code on the email verification page to confirm your email address.

If you did not request this code, please ignore this email or contact our support team immediately.

Thank you for joining StoryArcade. We look forward to having you as part of our community!

Best regards,
The StoryArcade Team`,
	};

	try {
		const user = await User.findOne({ email });
		await deleteExpiredOTPsOfUser(user);

		await transporter.sendMail(mailOptions);

		user.last_otps.push({ otp });
		await user.save();
	} catch (error) {
		console.error("Error sending OTP:", error);
		throw error;
	}
}

const verifyEmailOTP = asyncHandler(async (req, res) => {
	const { otp } = req.body;
	const jwt_recieved = req.headers.authorization.split(" ")[1];
	const { _id, role } = jwt.verify(jwt_recieved, process.env.JWT_SECRET);

	try {
		if (!otp) {
			return res.status(400).json({ message: "OTP is required" });
		}

		const user = await User.findOne({ _id });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const lastOTP = user.last_otps[user.last_otps.length - 1];

		if (!lastOTP) {
			return res.status(400).json({ message: "No OTP found" });
		}

		const otpCreatedAt = new Date(lastOTP.created_at);
		const otpExpirationTime = new Date(
			otpCreatedAt.getTime() + lastOTP.duration * 60000
		);

		if (lastOTP.used || new Date() > otpExpirationTime) {
			return res
				.status(400)
				.json({ message: "OTP is expired or already used" });
		}

		if (lastOTP.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		lastOTP.used = true;

		user.email_verified = true;

		await user.save();
		return res.status(200).json({ message: "OTP verified successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = {
	sendOtp,
	verifyEmailOTP,
};
