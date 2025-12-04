const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_firstName: { type: String, required: true },
  user_lastName: { type: String, required: true },
  user_profile: { type: String },
  user_comment: {
    type: String,
    trim: true,
    required: true,
  },
  admin_firstName: { type: String },
  admin_lastName: { type: String },
  admin_profile: { type: String, default: "" },
  admin_reply: { type: String, default: "" },
  reply_date: {
    date: { type: String, default: "" },
    time: { type: String, default: "" },
  },
  createdAt: {
    gregorianDate: {
      type: Date,
      default: Date.now(),
    },
    solarDate: {
      type: String,
    },
    time: {
      type: String,
    },
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
