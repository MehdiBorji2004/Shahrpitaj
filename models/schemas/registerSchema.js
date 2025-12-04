const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
    lowercase: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    lowercase: true,
  },
  phone: { type: String, required: true, trim: true, minlength: 11 },
  towel_code: { type: Number },
  imageUrl: { type: String, trim: true },
  role: { type: String, enum: ["admin", "user"], default: "User" },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, minlength: 4, maxlength: 4 },
  otpExpiresAt: { type: Date },
  attempts: { type: Number, default: 0 },
  activeReserves: {
    count: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "pending", "done"],
      default: "active",
    },
  },
  lastReserve: { type: String },
  totalReserves: { type: Number, default: 0 },
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

const User = mongoose.model("User", registerSchema);
module.exports = User;
