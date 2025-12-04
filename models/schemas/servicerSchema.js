const mongoose = require("mongoose");

const servicerSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  age: {type: Number, required: true},
  role: { type: String, required: true, trim: true },
  experience: { type: String, required: true },
  specialty: { type: String, required: true },
  imageUrl: { type: String, trim: true, default: "" },
  createdAt: {
    solarDate: { type: String },
    time: { type: String },
  },
});

const Servicer = mongoose.model("Servicer", servicerSchema);

module.exports = Servicer;
