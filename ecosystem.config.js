module.exports = {
  apps: [
    {
      name: "shahrpitaj-backend",
      script: "app.js",

      // اجرای دائم
      autorestart: true,
      watch: false,

      // منابع
      instances: 1,
      exec_mode: "fork",

      // متغیرهای محیطی
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // لاگ‌ها
      error_file: "/var/log/shahrpitaj-backend/error.log",
      out_file: "/var/log/shahrpitaj-backend/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
