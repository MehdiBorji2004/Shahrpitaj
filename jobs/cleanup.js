const cron = require("node-cron");
const User = require("../models/Register.js");

// هر روز ساعت 3 صبح اجرا شود
cron.schedule("0 3 * * *", async () => {
  const now = new Date();
  const result = await User.deleteMany({
    isVerified: false,
    otpExpiresAt: { $lt: now }, // زمان انقضا گذشته
  });
  console.log(
    `[CLEANUP JOB]: ${result.deletedCount} unverified users deleted.`
  );
});
