const mongoose = require("mongoose");

const buyStorySchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
    points_spent: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("BuyStory", buyStorySchema);