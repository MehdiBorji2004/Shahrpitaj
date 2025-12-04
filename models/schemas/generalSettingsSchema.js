const mongoose = require("mongoose");

const generalSettingSchema = new mongoose.Schema({
  baseInfo: {
    siteName: {
      type: String,
      required: true,
      trim: true,
      default: "شهر پیتاژ",
    },
    siteDescription: {
      type: String,
      required: true,
      trim: true,
      default: "آرایشگاه مردانه شهر پیتاژ با مدیریت مجتبی پورمظفر",
    },
  },
  contactInfo: {
    phone: { type: String, required: true, default: "09148314678" },
    address: {
      type: String,
      required: true,
      trim: true,
      default: "شهرستان اهر، آرایشگاه شهر پیتاژ",
    },
  },
  socialMediaInfo: {
    instagram: {
      type: String,
      trim: true,
      default: "https://instagram.com/shahrpitaj",
    },
    whatsApp: {
      type: String,
      trim: true,
      default: "https://wa.me/+989148314678",
    },
    telegram: {
      type: String,
      trim: true,
      default: "https://t.me/+989148314678",
    },
  },
  systemInfo: {
    maintenanceMode: { type: Boolean, required: true, default: false },
    allowOnlineReservation: { type: Boolean, required: true, default: true },
  },
});

const generalSettings = mongoose.model("generalSetting", generalSettingSchema);
module.exports = generalSettings;
