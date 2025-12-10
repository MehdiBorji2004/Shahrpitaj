const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      authSource: "admin",
      useNewUrlParser: true,
    });
    console.log("✅ connected to database successfully!");
  } catch (err) {
    console.log("❌ can not connect to database ×", err);
    process.exit(1);
  }
};

module.exports = connectDB;
