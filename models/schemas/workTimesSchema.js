const mongoose = require("mongoose");

const workTimesSchema = new mongoose.Schema({
  startHour: { type: Number, required: true, default: 10 },
  endHour: { type: Number, required: true, default: 20 },
  duration: { type: Number, required: true, default: 30 },
});

const WorkTimes = mongoose.model("WorkTime", workTimesSchema);

module.exports = WorkTimes;
