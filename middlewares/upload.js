// middleware/upload.js
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

if (!fs.existsSync("/var/www/uploads")) {
  fs.mkdirSync("/var/www/uploads", { recursive: true });
}

// تنظیم محل ذخیره فایل‌ها
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/var/www/uploads"); // مسیر ذخیره
  },
  filename: function (req, file, cb) {
    cb(null, crypto.randomUUID() + path.extname(file.originalname)); // اسم فایل یکتا
  },
});

const fileSize = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10,
  },
});

// فیلتر نوع فایل (مثلا فقط عکس)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("فقط فایل عکس مجاز است!");
  }
};

const upload = multer({ storage, fileFilter, fileSize });

module.exports = upload;
