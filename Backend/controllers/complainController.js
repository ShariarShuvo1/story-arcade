const mongoose = require("mongoose");
const User = require("../models/User");
const Story = require("../models/Story");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const StoryAccess = require("../models/StoryAccess");
const Follow = require("../models/Follow");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ComplainModel = require("../models/Complain");

const getComplain = asyncHandler(async (req, res) => {
	ComplainModel.find()
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

const updateComplain = asyncHandler(async (req, res) => {
	const { id } = req.params;
	console.log(id);
	ComplainModel.findByIdAndUpdate({ _id: id }, { done: true })
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

const deleteComplain = asyncHandler(async (req, res) => {
	const { id } = req.params;
	ComplainModel.findByIdAndDelete({ _id: id })
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

const addComplain = asyncHandler(async (req, res) => {
	const prob = req.body.prob;
	ComplainModel.create({
		prob: prob,
	})
		.then((result) => res.json(result))
		.catch((err) => res.json(err));
});

module.exports = {
	getComplain,
	updateComplain,
	deleteComplain,
	addComplain,
};
