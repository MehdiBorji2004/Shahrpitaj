// middleware/upload.js
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = "/var/www/uploads";

// ساخت پوشه با هندل خطا
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (err) {
  console.error("خطا در ساخت پوشه آپلود:", err);
  throw err;
}

// پسوندهای مجاز و MIME های مجاز
const ALLOWED_EXTENSIONS = /^(jpeg|jpg|png|webp)$/i;
const ALLOWED_MIME_SET = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

// تنظیم محل ذخیره فایل‌ها
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.test(ext.slice(1)) ? ext : "";
    cb(null, crypto.randomUUID() + safeExt);
  },
});

// فیلتر نوع فایل (فقط عکس)
const fileFilter = (req, file, cb) => {
  const ext = path.basename(file.originalname).toLowerCase().split(".").pop();

  const isExtValid = ALLOWED_EXTENSIONS.test(ext);
  const isMimeValid = ALLOWED_MIME_SET.has(file.mimetype);

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  }

  cb(new Error("فقط فایل عکس با فرمت jpg, jpeg, png, webp مجاز است!"));
};

// یک بار multer با همه تنظیمات
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
    fields: 20,
    parts: 30,
  },
});

// خطاها رو به‌جای throw کردن، به‌صورت error به next پاس می‌دیم
// تا تو route بتونی با try/catch یا error middleware بگیریش
const originalSingle = upload.single.bind(upload);
const originalArray = upload.array.bind(upload);
const originalFields = upload.fields.bind(upload);
const originalAny = upload.any.bind(upload);

upload.single = (field) => wrapMiddleware(originalSingle(field));
upload.array = (field, maxCount) =>
  wrapMiddleware(originalArray(field, maxCount));
upload.fields = (fields) => wrapMiddleware(originalFields(fields));
upload.any = () => wrapMiddleware(originalAny());

// wrapper برای هندل خطاهای multer به شکل یک middleware استاندارد
function wrapMiddleware(mw) {
  return function (req, res, next) {
    mw(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const map = {
          LIMIT_FILE_SIZE: "حجم فایل بیش از 5 مگابایت است",
          LIMIT_FILE_COUNT: "تعداد فایل‌ها بیش از حد مجاز است",
          LIMIT_UNEXPECTED_FILE: "فایل غیرمجاز",
        };
        return res.status(400).json({ message: map[err.code] || err.message });
      }

      if (err) {
        return res.status(400).json({ message: err.message || "خطای آپلود" });
      }

      next();
    });
  };
}

module.exports = upload;
