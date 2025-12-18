require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./configs/database/db.js");
const appRouter = require("./routes/appRoutes.js");
const protectedRouter = require("./routes/protectedRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");

const app = express();

connectDB();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://shahrpitaj.ir",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", appRouter);
app.use("/auth", protectedRouter);
app.use("/admin", adminRouter);

// Error Handler Middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: "خطای سرور",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
