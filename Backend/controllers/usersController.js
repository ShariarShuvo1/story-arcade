const mongoose = require("mongoose");
const User = require("../models/User");
const StoryAccess = require("../models/StoryAccess");
const Story = require("../models/Story");
const Follow = require("../models/Follow");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { sendOtp } = require("./functions/emailVerificationController");

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

  const user = await User.findOne({ email }).select("+password").lean().exec();

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user._id, user.role);
  if (!user.email_verified) {
    await sendOtp(email, user.name);
  }
  return res.status(201).json({
    token,
    message: "User logged in",
    verified: user.email_verified,
  });
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
    await sendOtp(email, user.name);
    return res.status(201).json({ token, message: "User created" });
  } else {
    return res.status(400).json({ message: "Invalid user data received" });
  }
});

const getPointsLeft = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ point: user.points_left });
});

const getName = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ name: user.name });
});

const checkIfFollow = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const author_id = req.body.author;
  const author = await User.findById(author_id).lean().exec();
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  const follow = await Follow.findOne({
    follow: author_id,
    follower: user_id,
  })
    .lean()
    .exec();

  if (!follow) {
    return res.status(404).json({ follow: false });
  }

  return res.status(200).json({ follow: true });
});

const followUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const to_follow_id = req.body.to_follow;
  const toFollow = await User.findById(to_follow_id).lean().exec();
  if (!toFollow) {
    return res.status(404).json({ message: "User not found" });
  }
  let follow = await Follow.findOne({
    follow: to_follow_id,
    follower: user_id,
  })
    .lean()
    .exec();

  if (follow) {
    return res.status(404).json({ message: "You already follow this User" });
  }
  follow = await Follow.create({ follow: to_follow_id, follower: user_id });

  return res.status(200).json({ follow: true });
});

const getFriendSuggestion = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = new mongoose.Types.ObjectId(decoded._id);

  const user = await User.findById(user_id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const friends = await Follow.find({ follower: user_id })
    .distinct("follow")
    .exec();

  let potentialFriends = await StoryAccess.aggregate([
    { $match: { user: user_id } },
    {
      $lookup: {
        from: "stories",
        localField: "story",
        foreignField: "_id",
        as: "storyDetails",
      },
    },
    { $unwind: "$storyDetails" },
    {
      $group: {
        _id: "$storyDetails.uploader",
        nonPrivateStoryCount: {
          $sum: {
            $cond: [{ $ne: ["$storyDetails.access_level", "private"] }, 1, 0],
          },
        },
      },
    },
    { $match: { _id: { $ne: user_id, $nin: friends } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $project: {
        _id: 1,
        name: "$userDetails.name",
        avatar: "$userDetails.avatar",
        nonPrivateStoryCount: 1,
      },
    },
    { $limit: 10 },
  ]).exec();

  if (potentialFriends.length < 10) {
    const additionalUsers = await User.aggregate([
      { $match: { _id: { $ne: user_id, $nin: friends } } },
      { $sample: { size: 10 - potentialFriends.length } },
      {
        $lookup: {
          from: "stories",
          localField: "_id",
          foreignField: "uploader",
          as: "stories",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          nonPrivateStoryCount: {
            $size: {
              $filter: {
                input: "$stories",
                as: "story",
                cond: {
                  $ne: ["$$story.access_level", "private"],
                },
              },
            },
          },
        },
      },
    ]).exec();

    potentialFriends = potentialFriends.concat(additionalUsers);
  }

  return res.status(200).json({ suggestions: potentialFriends });
});

// This is a dummy and insecure function
const addPoints = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const package_name = req.body.package_name;

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Request" });
  }
  const user_id = decoded._id;
  const user = await User.findById(user_id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!package_name) {
    return res.status(400).json({ message: "Package not found" });
  }

  let points = 0;
  if (package_name === "sack") {
    points = 500;
  } else if (package_name === "pot") {
    points = 3000;
  } else if (package_name === "crate") {
    points = 7000;
  }

  await User.findByIdAndUpdate(user_id, {
    $inc: { points_left: points },
  }).exec();

  return res.status(200).json({ message: "Points added to your account" });
});

const getTotalUsers = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = {
  loginUser,
  createNewUser,
  getPointsLeft,
  getName,
  addPoints,
  getFriendSuggestion,
  checkIfFollow,
  followUser,
  getTotalUsers,
};
