const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  serviceDetails: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  servicePath: { type: String, required: true, unique: true },
  servicePortfolio: [{ type: String, default: "" }],
  imageUrl: { type: String, required: true },
  createdAt: {
    solarDate: { type: String },
    time: { type: String },
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
