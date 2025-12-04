const Reserve = require("../models/schemas/reserveSchema.js");
const User = require("../models/schemas/registerSchema.js");
const PersianDate = require("persian-date");
const WorkTimes = require("./schemas/workTimesSchema.js");

const persianDate = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("YYYY-MM-DD");

const persianTime = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("HH:mm:ss");

const reserve = async (id, reserveData) => {
  try {
    const user = await User.findById(id);

    const today = persianDate;

    if (!user.activeReserves || typeof user.activeReserves !== "object") {
      user.activeReserves = { count: 0, status: "active" };
    } else {
      user.activeReserves.count = Number(user.activeReserves.count) || 0;
    }

    if (user.lastReserve !== today) {
      user.activeReserves.count = 0;
      user.lastReserve = today;
    }

    if (user.role === "user" && user.activeReserves.count >= 2) {
      return {
        success: false,
        status: 400,
        message: "رزرو بیش از دو نوبت در روز مجاز نیست",
      };
    } else {
      user.activeReserves.count += 1;
      user.totalReserves = (user.totalReserves || 0) + 1;
      user.lastReserve = today;
      await user.save();

      const newReserve = new Reserve({
        userID: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        towel_code: user.towel_code || 0,
        ...reserveData,
        createdAt: {
          gregorianDate: new Date(),
          solarDate: persianDate,
          time: persianTime,
        },
      });

      const savedReserve = await newReserve.save();

      return {
        success: true,
        status: 201,
        message: "رزرو شما با موفقیت ثبت شد",
        data: savedReserve,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در ثبت رزرو. لطفا اطلاعات را بررسی کنید.",
    };
  }
};

const cancel = async (id) => {
  try {
    const deleteResult = await Reserve.findByIdAndDelete(id);
    if (deleteResult) {
      const user = await User.findById(deleteResult.userID);
      if (user.activeReserves > 0 || user.totalReserves > 0) {
        user.activeReserves.count -= 1;
        user.totalReserves -= 1;
        await user.save();
        return {
          success: true,
          status: 200,
          message: "نوبت شما با موفقیت لغو شد",
        };
      }
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ نوبتی برای لغو کردن پیدا نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در لغو نوبت",
    };
  }
};

const myReserves = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { success: false, status: 404, message: "کاربر یافت نشد" };
    }

    const reservedData = await Reserve.find({
      userID: id,
      status: "active",
    }).sort({
      "date.jy": 1,
      "date.jm": 1,
      "date.jd": 1,
      time: 1,
    });

    // helpers برای صفرپر کردن و ساخت رشته تاریخ/زمان
    const pad2 = (n) => String(n ?? 0).padStart(2, "0");
    const makeDateStr = (d) =>
      d && d.jy != null && d.jm != null && d.jd != null
        ? `${d.jy}-${pad2(d.jm)}-${pad2(d.jd)}`
        : null;
    const makeTimeStr = (t) => {
      if (!t) return "00:00:00";
      const parts = ("" + t).split(":");
      // تضمین سه بخش ساعت:دقیقه:ثانیه
      return [parts[0] || "00", parts[1] || "00", parts[2] || "00"]
        .map((p) => pad2(Number(p)))
        .join(":");
    };

    const today = persianDate; // "YYYY-MM-DD"
    const now = makeTimeStr(persianTime);

    const validReserves = reservedData.filter((item) => {
      const rDate = makeDateStr(item.date);
      if (!rDate) return false;

      if (rDate > today) return true; // تاریخ بعد از امروز
      if (rDate < today) return false; // قبل از امروز

      // تاریخ برابر امروز -> مقایسه زمان با رشته (هر دو "HH:MM:SS")
      const rTime = makeTimeStr(item.time || item.createdAt?.time);
      return rTime >= now;
    });

    if (validReserves.length === 0) {
      return { success: false, status: 404, message: "هیچ رزروی پیدا نشد" };
    }

    return {
      success: true,
      status: 200,
      message: "رزروهای فعال شما دریافت شد",
      data: validReserves,
    };
  } catch (error) {
    console.error("myReserves error:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت رزروها",
      error: error.message,
    };
  }
};

const getTimes = async (y, m, d, servicerName) => {
  const reserves = await Reserve.find(
    {
      "date.jy": y,
      "date.jm": m,
      "date.jd": d,
      servicer_name: servicerName,
    },
    { time: 1, _id: 0 }
  );
  const times = reserves.map((reserve) => reserve.time);
  return {
    success: true,
    status: 200,
    message: "زمان هایی که رزرو شده اند با موفقیت دریافت شد",
    data: times,
  };
};

const getWorkTimes = async () => {
  try {
    const workTimes = await WorkTimes.findOne({});

    return {
      success: true,
      status: 200,
      data: workTimes,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در پیدا کردن زمان ها ❌",
    };
  }
};

module.exports = { reserve, cancel, myReserves, getTimes, getWorkTimes };
