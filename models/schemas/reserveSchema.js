const mongoose = require("mongoose");

const reserveSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
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
  towel_code: { type: Number, default: 0 },
  service_type: {
    type: String,
    required: true,
  },
  servicer_name: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: { type: Number },
  status: {
    type: String,
    enum: ["active", "done", "canceled"],
    default: "active",
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

const Reserve = mongoose.model("Reserve", reserveSchema);
module.exports = Reserve;
