require("dotenv").config();
const User = require("./schemas/registerSchema.js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const PersianDate = require("persian-date");

// ایجاد تاریخ فعلی ایران
const persianDate = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("YYYY-MM-DD");

// ایجاد ساعت فعلی ایران
const persianTime = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("HH:mm:ss");

// تولید کد تصادفی
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
// تولید زمان انقضای کد
const generateOtpExpires = () => {
  return new Date(Date.now() + 3 * 60 * 1000);
};

// دریافت کد تایید از پنل پیامکی sms.ir
const getOTP = async (data) => {
  const res = await axios.post("https://api.sms.ir/v1/send/verify", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": process.env.SMSIR_API_KEY,
    },
  });

  return res;
};

// add new user
const signupUser = async (userData) => {
  const { first_name, last_name, phone } = userData;

  try {
    const isUserExists = await User.findOne({ phone });
    if (isUserExists && isUserExists.isVerified) {
      return {
        success: false,
        status: 409,
        message: "کاربری با این اطلاعات از قبل وجود دارد. لطفا وارد شوید.",
      };
    } else if (isUserExists && !isUserExists.isVerified) {
      // دیتای لازم برای ارسال به پنل پیامکی sms.ir برای دریافت کد تایید
      const dateToSend = {
        Mobile: isUserExists.phone,
        TemplateId: Number(process.env.SMSIR_TEMPLATE_ID),
        Parameters: [
          {
            name: "CODE",
            value: "12345",
          },
        ],
      };

      try {
        const response = await getOTP(dateToSend);
        console.log(response.data);
      } catch (error) {
        console.log("error in getting OTP code!");
      }

      // const otp = generateOTP();
      // const otpExpiresAt = generateOtpExpires();
      // isUserExists.otp = otp;
      // isUserExists.otpExpiresAt = otpExpiresAt;
      isUserExists.attempts = 0;
      await isUserExists.save();

      // console.log(
      //   `*verification code for signup sent to the ${phone}* --code: ${otp}`
      // );

      return {
        success: true,
        status: 200,
        message: "کد تایید ارسال شد",
      };
    } else {
      const usersCount = await User.countDocuments();
      const role =
        usersCount === 0 && phone === process.env.ADMIN_PHONE
          ? "admin"
          : "user";

      const otp = generateOTP();
      const otpExpiresAt = generateOtpExpires();
      const newUser = await User.create({
        first_name,
        last_name,
        phone,
        role,
        otp,
        otpExpiresAt,
        createdAt: {
          gregorianDate: new Date(),
          solarDate: persianDate,
          time: persianTime,
        },
      });

      // send code to user
      console.log(
        `*verification code for signup sent to the ${phone}* --code: ${otp}`
      );

      return {
        success: true,
        status: 200, // Success - کاربر با موفقیت ایجاد شد
        message: "کد تایید ارسال شد",
      };
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// login user
const loginUser = async (phone) => {
  const existedUser = await User.findOne({ phone });
  if (existedUser) {
    //  generate random otp code & expires in 3 minute
    const otp = generateOTP();
    const otpExpiresAt = generateOtpExpires();

    existedUser.otp = otp;
    existedUser.otpExpiresAt = otpExpiresAt;
    await existedUser.save();

    // send code to user
    console.log(
      `*verification code for login sent to the ${phone}* --code: ${otp}`
    );

    return {
      success: true,
      status: 200,
      message: "کد تایید ارسال شد",
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "کاربری با این شماره موبایل وجود ندارد! لطفا ثبت نام کنید",
    };
  }
};

// verify entred user otp
const verify = async (phone, otp, forLogin) => {
  try {
    const user = await User.findOne({ phone });
    // validate user and otp
    if (!user) {
      return {
        success: false,
        status: 404, // Not Found - کاربری با این شماره موبایل پیدا نشد
        message: "کاربری با این شماره موبایل پیدا نشد!",
      };
    } else if (user.otp !== otp) {
      user.attempts += 1;
      await user.save();
      if (user.attempts > 3) {
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        return {
          success: false,
          status: 429, // Too Many Requests - تعداد تلاش‌های ناموفق بیش از حد مجاز
          message:
            "تلاش های ناموفق بیش از حد! کد تایید باطل شد لطفا روی ارسال مجدد کلیک کنید.",
        };
      }
      return {
        success: false,
        status: 400, // Bad Request - کد تایید اشتباه است
        message: `کد تایید صحیح نمی باشد! ${3 - user.attempts} تلاش باقی مانده`,
      };
    } else if (user.otpExpiresAt < new Date()) {
      return {
        success: false,
        status: 410, // Gone - کد منقضی شده است
        message: "کد منقصی شده است!",
      };
    } else if (!forLogin && user.isVerified) {
      //اگر درحال ثبت نام هستیم و کاربر قبلا تایید شده است
      return {
        success: false,
        status: 409, // Conflict - کاربر قبلاً ثبت نام کرده است
        message: "شما قبلا ثبت نام کرده اید لطفا وارد شوید!",
      };
    } else if (forLogin && !user.isVerified) {
      // اگر درحال ورود هستیم و کاربر تایید نشده است
      return {
        success: false,
        status: 403,
        message: "حساب شما تایید نشده است ابتدا ثبت نام کنید!",
      };
    } else {
      user.otp = null;
      user.otpExpiresAt = null;
      user.attempts = 0;
      // اگر در حال ثبت نام هستیم کاربر را تایید میکنیم
      if (!forLogin) {
        user.isVerified = true;
      }

      const savedUser = await user.save();

      const token = jwt.sign(
        {
          id: savedUser._id,
          role: savedUser.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: user.role === "admin" ? "30d" : "7d",
        }
      );

      return {
        success: true,
        status: 200, // Success - کاربر با موفقیت ثبت نام شد
        message: forLogin
          ? "ورود شما با موفقیت انجام شد"
          : "ثبت نام شما با موفقیت انجام شد",
        token,
        data: savedUser,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// resend verification code
const resend = async (phone) => {
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "کاربری با این شماره موبایل پیدا نشد",
      };
    }

    // زمان ارسال مجدد 1 دقیقه
    const resendTime = new Date(user.otpExpiresAt - 120000);
    if (new Date() < resendTime) {
      return {
        success: false,
        status: 429,
        message: "لطفا قبل از درخواست دوباره 1 دقیقه صبر کنید!",
      };
    } else {
      const otp = generateOTP();
      const otpExpiresAt = generateOtpExpires();

      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      user.attempts = 0;
      await user.save();

      // resend code to user
      console.log(
        `*verification code send again to the ${phone}* --code: ${otp}`
      );

      return {
        success: true,
        status: 200,
        message: "کد تایید دوباره ارسال شد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error.message,
    };
  }
};

module.exports = { signupUser, verify, loginUser, resend };
