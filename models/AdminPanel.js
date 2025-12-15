const fs = require("fs");
const path = require("path");
const User = require("./schemas/registerSchema");
const Reserve = require("./schemas/reserveSchema");
const Service = require("./schemas/serviceSchema");
const Servicer = require("./schemas/servicerSchema");
const PersianDate = require("persian-date");
const WorkTimes = require("./schemas/workTimesSchema");
const Comment = require("./schemas/commentSchema");
const generalSettings = require("./schemas/generalSettingsSchema");

const persianDate = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("YYYY-MM-DD");

const persianTime = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("HH:mm:ss");
  
const usersList = async (startDate, endDate) => {
  try {
    // ساخت شرط جستجو بر اساس وجود یا عدم وجود پارامترها
    let query = { role: "user" };

    // اگر هر دو پارامتر تاریخ وجود داشتند
    if (startDate && endDate) {
      query["createdAt.solarDate"] = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const users = await User.find(query);

    return {
      success: true,
      status: 200,
      message: "لیست کاربران با موفقیت دریافت شد",
      data: users,
    };
  } catch (error) {
    console.error("Error in usersList:", error);
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت لیست کاربران",
    };
  }
};

const usersCount = async () => {
  try {
    const users = await User.find({ role: "user" });

    if (users && users.length > 0) {
      return {
        success: true,
        status: 200,
        message: "تعداد کاربران با موفقیت دریافت شد",
        data: users.length,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ کاربری یافت نشد",
      };
    }
  } catch (error) {
    console.error("Error in users count:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت تعداد کاربران",
    };
  }
};

const adminsList = async () => {
  try {
    const admins = await User.find({
      role: "admin",
    });
    if (admins) {
      return {
        success: true,
        status: 200,
        message: "لیست ادمین ها با موفقیت دریافت شد",
        data: admins,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ ادمینی یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت لیست ادمین ها",
    };
  }
};

const allReserves = async (startDateParsed, endDateParsed) => {
  try {
    let query = {};
    if (startDateParsed && endDateParsed) {
      query = {
        ...query,
        $and: [
          {
            $or: [
              { "date.jy": { $gt: startDateParsed.year } },
              {
                "date.jy": startDateParsed.year,
                "date.jm": { $gt: startDateParsed.month },
              },
              {
                "date.jy": startDateParsed.year,
                "date.jm": startDateParsed.month,
                "date.jd": { $gte: startDateParsed.day },
              },
            ],
          },
          {
            $or: [
              { "date.jy": { $lt: endDateParsed.year } },
              {
                "date.jy": endDateParsed.year,
                "date.jm": { $lt: endDateParsed.month },
              },
              {
                "date.jy": endDateParsed.year,
                "date.jm": endDateParsed.month,
                "date.jd": { $lte: endDateParsed.day },
              },
            ],
          },
        ],
      };
    }
    const all_reserves = await Reserve.find(query).sort({
      "date.jy": 1,
      "date.jm": 1,
      "date.jd": 1,
    });
    return {
      success: true,
      status: 200,
      message: "لیست تمام رزروها با موفقیت دریافت شد",
      data: all_reserves,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت لیست تمام رزروها",
    };
  }
};

const activeReserves = async (startDateParsed, endDateParsed) => {
  try {
    const today = new PersianDate().toLocale("en").format("YYYY-MM-DD");
    const nowRaw = new PersianDate().toLocale("en").format("HH:mm:ss");

    let query = { status: "active" };
    if (startDateParsed && endDateParsed) {
      query = {
        ...query,
        $and: [
          {
            $or: [
              { "date.jy": { $gt: startDateParsed.year } },
              {
                "date.jy": startDateParsed.year,
                "date.jm": { $gt: startDateParsed.month },
              },
              {
                "date.jy": startDateParsed.year,
                "date.jm": startDateParsed.month,
                "date.jd": { $gte: startDateParsed.day },
              },
            ],
          },
          {
            $or: [
              { "date.jy": { $lt: endDateParsed.year } },
              {
                "date.jy": endDateParsed.year,
                "date.jm": { $lt: endDateParsed.month },
              },
              {
                "date.jy": endDateParsed.year,
                "date.jm": endDateParsed.month,
                "date.jd": { $lte: endDateParsed.day },
              },
            ],
          },
        ],
      };
    }

    const reserves = await Reserve.find(query).sort({
      "date.jy": 1,
      "date.jm": 1,
      "date.jd": 1,
      time: 1,
    });

    // helper ها برای صفر‑پر کردن و ساخت رشته‌ها
    const pad2 = (v) => String(Number(v || 0)).padStart(2, "0");
    const makeDateStr = (d) =>
      d && d.jy != null && d.jm != null && d.jd != null
        ? `${d.jy}-${pad2(d.jm)}-${pad2(d.jd)}`
        : null;
    const makeTimeStr = (t) => {
      if (!t) return "00:00:00";
      const parts = ("" + t).split(":");
      const hh = pad2(parts[0] || "00");
      const mm = pad2(parts[1] || "00");
      const ss = pad2(parts[2] || "00");
      return `${hh}:${mm}:${ss}`;
    };

    const now = makeTimeStr(nowRaw);

    const validReserves = reserves.filter((item) => {
      const rDate = makeDateStr(item.date);
      if (!rDate) return false;

      if (rDate > today) return true;
      if (rDate < today) return false;

      const rTime = makeTimeStr(item.time || item.createdAt?.time);
      return rTime >= now;
    });

    return {
      success: true,
      status: 200,
      message: "لیست رزرو های فعال با موفقیت دریافت شد",
      data: validReserves,
    };
  } catch (error) {
    console.error("Error in activeReserves:", error);
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت رزرو های فعال",
      error: error.message,
    };
  }
};

const doneReserves = async (startDateParsed, endDateParsed) => {
  try {
    // ساخت شرط جستجو بر اساس status
    let query = { status: "done" };

    // اضافه کردن شرط‌های تاریخ فقط اگر هر دو پارامتر موجود باشند
    if (startDateParsed && endDateParsed) {
      query = {
        ...query,
        $and: [
          {
            $or: [
              { "date.jy": { $gt: startDateParsed.year } },
              {
                "date.jy": startDateParsed.year,
                "date.jm": { $gt: startDateParsed.month },
              },
              {
                "date.jy": startDateParsed.year,
                "date.jm": startDateParsed.month,
                "date.jd": { $gte: startDateParsed.day },
              },
            ],
          },
          {
            $or: [
              { "date.jy": { $lt: endDateParsed.year } },
              {
                "date.jy": endDateParsed.year,
                "date.jm": { $lt: endDateParsed.month },
              },
              {
                "date.jy": endDateParsed.year,
                "date.jm": endDateParsed.month,
                "date.jd": { $lte: endDateParsed.day },
              },
            ],
          },
        ],
      };
    }

    const reserves = await Reserve.find(query).sort({
      "date.jy": 1,
      "date.jm": 1,
      "date.jd": 1,
    });

    return {
      success: true,
      status: 200,
      message: "لیست رزرو های انجام شده با موفقیت دریافت شد",
      data: reserves,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت رزرو های انجام شده",
    };
  }
};

const canceledReserves = async () => {
  try {
    const reserves = await Reserve.find({ status: "canceled" });
    return {
      success: true,
      status: 200,
      message: "لیست رزرو های کنسل شده با موفقیت دریافت شد",
      data: reserves,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت رزرو های کنسل شده",
    };
  }
};

const totalRevenue = async (startDateParsed, endDateParsed) => {
  try {
    const prices = await Reserve.find(
      {
        status: "done",
        $and: [
          // شرط برای تاریخ شروع
          {
            $or: [
              {
                "date.jy": { $gt: startDateParsed.year },
              },
              {
                "date.jy": startDateParsed.year,
                "date.jm": { $gt: startDateParsed.month },
              },
              {
                "date.jy": startDateParsed.year,
                "date.jm": startDateParsed.month,
                "date.jd": { $gte: startDateParsed.day },
              },
            ],
          },
          // شرط برای تاریخ پایان
          {
            $or: [
              {
                "date.jy": { $lt: endDateParsed.year },
              },
              {
                "date.jy": endDateParsed.year,
                "date.jm": { $lt: endDateParsed.month },
              },
              {
                "date.jy": endDateParsed.year,
                "date.jm": endDateParsed.month,
                "date.jd": { $lte: endDateParsed.day },
              },
            ],
          },
        ],
      },
      { price: 1, _id: 0 }
    ).sort({ "date.jy": 1, "date.jm": 1, "date.jd": 1 });

    if (prices && prices.length > 0) {
      const priceValues = prices.map((item) => Number(item.price));
      const totalRevenue = priceValues.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      return {
        success: true,
        status: 200,
        message: "درآمد کل با موفقیت محاسبه و دریافت شد",
        data: totalRevenue,
      };
    } else {
      return {
        success: false,
        data: 0,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در محاسبه درآمد کل",
    };
  }
};

const changeStatus = async (id) => {
  try {
    const activeResrve = await Reserve.findById(id);
    if (activeResrve && activeResrve.status === "active") {
      activeResrve.status = "done";
      await activeResrve.save();
      return {
        success: true,
        status: 200,
        message: "خدمات مربوطه با موفقیت انجام شد",
        data: activeResrve.status,
      };
    } else {
      return {
        success: false,
        status: 409,
        message: "خدمات از قبل انجام شده یا وجود ندارد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در به انجام رساندن خدمات",
    };
  }
};

const cancelReserve = async (id) => {
  try {
    const reserve = await Reserve.findById(id);
    if (reserve) {
      reserve.status = "canceled";
      await reserve.save();
      return {
        success: true,
        status: 200,
        message: "نوبت مورد نظر با موفقیت لغو شد",
        data: reserve,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "نوبتی برای لغو یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در لغو نوبت",
    };
  }
};

const upgradeUser = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user) {
      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
        return {
          success: true,
          status: 200,
          message: "نقش کاربر با موفقیت ارتقا یافت",
          data: user.role,
        };
      } else {
        return {
          success: false,
          status: 409,
          message: "کاربر از قبل ادمین است",
        };
      }
    } else {
      return {
        success: false,
        status: 404,
        message: "کاربر یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در ارتقا نقش کاربر",
    };
  }
};

const deleteUser = async (userID) => {
  try {
    const user = await User.findByIdAndDelete(userID);
    if (user) {
      return {
        success: true,
        status: 200,
        message: "کاربر با موفقیت حذف شد",
        data: user,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "کاربری برای حذف یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در حذف کاربر",
    };
  }
};

const descentAdmin = async (adminID) => {
  try {
    const admin = await User.findById(adminID);
    if (admin) {
      if (admin.role === "admin") {
        admin.role = "user";
        await admin.save();
        return {
          success: true,
          status: 200,
          message: "نقش ادمین با موفقیت به کاربر تغییر یافت",
          data: admin.role,
        };
      } else {
        return {
          success: false,
          status: 409,
          message: "کاربر ادمین نیست",
        };
      }
    } else {
      return {
        success: false,
        status: 404,
        message: "کاربر یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در تغییر نقش ادمین",
    };
  }
};

const deleteService = async (serviceID) => {
  try {
    const service = await Service.findByIdAndDelete(serviceID);
    if (service) {
      return {
        success: true,
        status: 200,
        message: "خدمات با موفقیت حذف شد",
        data: service,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدماتی برای حذف یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در حذف خدمات",
    };
  }
};

const addService = async (
  serviceName,
  serviceDetails,
  servicePrice,
  servicePath,
  imageUrl
) => {
  try {
    const existedService = await Service.find({
      serviceName,
      servicePrice,
    });
    if (existedService.length > 0) {
      return {
        success: false,
        status: 409,
        message: "خدماتی با این اطلاعات از قبل وجود دارد",
      };
    } else {
      const newService = await Service.create({
        serviceName,
        serviceDetails,
        servicePrice,
        servicePath,
        imageUrl,
        createdAt: {
          solarDate: persianDate,
          time: persianTime,
        },
      });
      await newService.save();
      return {
        success: true,
        status: 201,
        message: "خدمات جدید با موفقیت ایجاد شد",
        data: newService,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در ایجاد خدمات جدید",
    };
  }
};

const addServicer = async (servicerData, imageUrl) => {
  try {
    const { first_name, last_name } = servicerData;
    const existedServicer = await Servicer.find({
      first_name,
      last_name,
    });
    if (existedServicer.length > 0) {
      return {
        success: false,
        status: 409,
        message: "خدمات دهنده ای با این اطلاعات از قبل وجود دارد",
      };
    } else {
      const newServicer = await Servicer.create({
        ...servicerData,
        imageUrl: imageUrl || "",
        createdAt: {
          solarDate: persianDate,
          time: persianTime,
        },
      });
      return {
        success: true,
        status: 201,
        message: "خدمات دهنده جدید با موفقیت ایجاد شد",
        data: newServicer,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطا در ایجاد خدمات دهنده جدید",
    };
  }
};

const deleteServicer = async (servicerID) => {
  try {
    const servicer = await Servicer.findByIdAndDelete(servicerID);
    if (servicer) {
      return {
        success: true,
        status: 200,
        message: "خدمات دهنده با موفقیت حذف شد",
        data: servicer,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدمات دهنده ای برای حذف یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطا در حذف خدمات دهنده",
    };
  }
};

const changeWorkTimes = async (startHour, endHour, duration) => {
  try {
    const workTime = await WorkTimes.findOneAndUpdate(
      {},
      {
        startHour,
        endHour,
        duration,
      },
      {
        new: true, // برگرداندن سند آپدیت شده
        upsert: true, // اگر وجود نداشت، ایجاد کن
        setDefaultsOnInsert: true,
      }
    );

    return {
      success: true,
      status: workTime.isNew ? 201 : 200,
      message: workTime.isNew
        ? "زمان ها با موفقیت ایجاد شد"
        : "زمان ها با موفقیت تغییر یافت",
      data: workTime,
    };
  } catch (error) {
    console.error("Error in changeWorkTimes:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در تغییر زمان ها",
    };
  }
};

const setReply = async (adminID, adminReply, commentID) => {
  try {
    const admin = await User.findById(adminID);
    const existedComment = await Comment.findById(commentID);
    if (admin && existedComment) {
      existedComment.admin_firstName = admin.first_name;
      existedComment.admin_lastName = admin.last_name;
      existedComment.admin_profile = admin.imageUrl;
      existedComment.admin_reply = adminReply;
      existedComment.reply_date.date = persianDate;
      existedComment.reply_date.time = persianTime;
      await existedComment.save();
      return {
        success: true,
        status: 200,
        message: "پاسخ شما با موفقیت ثبت شد",
        data: existedComment,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ کامنتی برای ثبت پاسخ یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در ثبت پاسخ",
    };
  }
};

const deleteComment = async (commentID) => {
  try {
    const comment = await Comment.findByIdAndDelete(commentID);
    if (comment) {
      return {
        success: true,
        status: 200,
        message: "کامنت مورد نظر با موفقیت حذف شد",
        data: comment,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "کامنتی برای حذف یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در حذف کامنت",
    };
  }
};

const setPortfolio = async (serviceID, imagesUrl) => {
  try {
    const service = await Service.findById(serviceID);
    if (service) {
      service.servicePortfolio = imagesUrl;
      await service.save();
      return {
        success: true,
        status: 200,
        message: "نمونه کار های شما با موفقیت آپلود شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدماتی برای آپلود نمونه کارها یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در آپلود نمونه کارها",
    };
  }
};

const getPortfolio = async (serviceID) => {
  try {
    const service = await Service.findById(serviceID);
    if (service) {
      return {
        success: true,
        status: 200,
        message: "نمونه کارها با موفقیت دریافت شد",
        data: service.servicePortfolio,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدماتی برای دریافت نمونه کارها یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت نمونه کارها",
    };
  }
};

const activeUsers = async () => {
  try {
    // تاریخ دو ماه قبل
    const twoMonthsAgo = new PersianDate()
      .subtract("months", 2)
      .toLocale("en")
      .format("YYYY-MM-DD");

    const activeUsers = await User.find({
      lastReserve: {
        $gte: twoMonthsAgo,
      },
    });

    if (activeUsers.length > 0) {
      return {
        success: true,
        status: 200,
        message: "لیست کاربران فعال با موفقیت دریافت شد",
        data: activeUsers,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ کاربر فعالی در دو ماه اخیر یافت نشد",
      };
    }
  } catch (error) {
    console.error("Error in activeUsers:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت لیست کاربران فعال",
    };
  }
};

const inactiveUsers = async () => {
  try {
    // تاریخ دو ماه قبل
    const twoMonthsAgo = new PersianDate()
      .subtract("months", 2)
      .toLocale("en")
      .format("YYYY-MM-DD");

    const inactiveUsers = await User.find({
      lastReserve: {
        $lt: twoMonthsAgo,
      },
    });

    return {
      success: true,
      status: 200,
      message: "لیست کاربران غیرفعال با موفقیت دریافت شد",
      data: inactiveUsers,
    };
  } catch (error) {
    console.error("Error in inactiveUsers:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت لیست کاربران غیرفعال",
    };
  }
};

const newUsers = async () => {
  try {
    const today = new PersianDate().toLocale("en").format("YYYY-MM-DD");

    const newUsers = await User.find({
      "createdAt.solarDate": today,
      role: "user",
    });

    return {
      success: true,
      status: 200,
      message: "لیست کاربران امروز با موفقیت دریافت شد",
      data: newUsers,
    };
  } catch (error) {
    console.error("Error in newUsers:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت لیست کاربران جدید",
    };
  }
};

const editService = async (serviceID, newData) => {
  try {
    const service = await Service.findById(serviceID);
    if (service) {
      service.serviceName = newData.serviceName;
      service.serviceDetails = newData.serviceDetails;
      service.servicePrice = newData.servicePrice;

      await service.save();

      return {
        success: true,
        status: 200,
        message: "خدمات مورد نظر با موفقیت ویرایش شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدماتی برای ویرایش یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در ویرایش خدمات",
    };
  }
};

const changeServiceImg = async (imageUrl, serviceID) => {
  try {
    const service = await Service.findById(serviceID);
    if (service) {
      service.imageUrl = imageUrl;
      await service.save();
      return {
        success: true,
        status: 200,
        message: "عکس خدمات با موفقیت تغییر یافت",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدماتی برای تغییر عکس یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در تغییر عکس خدمات",
    };
  }
};

const deleteServicePortfolio = async (serviceID, imageUrl) => {
  try {
    const service = await Service.findById(serviceID);
    if (service) {
      // حذف فایل از دیتابیس
      const filteredPortfolio = service.servicePortfolio.filter(
        (item) => item !== imageUrl
      );
      service.servicePortfolio = filteredPortfolio;
      await service.save();

      // استخراج نام فایل از URL
      const filename = path.basename(imageUrl);
      // مسیر کامل فایل در پوشه uploads
      const filePath = path.join(__dirname, "../uploads", filename);
      // حذف فایل از سیستم فایل
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.log(filename, "not found");
      }

      return {
        success: true,
        status: 200,
        message: "نمونه کار مورد نظر با موفقیت حذف شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "نمونه کاری برای حذف یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در حذف نمونه کار",
    };
  }
};

const getGeneralSettingsInfo = async () => {
  try {
    const info = await generalSettings.find({});
    if (info.length > 0) {
      return {
        success: true,
        status: 200,
        message: "اطلاعات سایت با موفقیت دریافت شد",
        data: info,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ اطلاعاتی یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت اطلاعات",
    };
  }
};

const updateGeneralSettings = async (newData) => {
  try {
    let settings = await generalSettings.findOne({});

    if (settings) {
      const updatedSettings = await generalSettings.findOneAndUpdate(
        {},
        { $set: newData },
        {
          new: true,
          runValidators: true,
        }
      );
      return {
        success: true,
        status: 200,
        message: "تنظیمات عمومی با موفقیت به‌روز شد",
      };
    } else {
      const newSettings = await generalSettings.create(newData);

      return {
        success: true,
        status: 201,
        message: "تنظیمات عمومی با موفقیت ایجاد شد",
        data: newSettings,
      };
    }
  } catch (error) {
    console.error("Error in updateGeneralSettings:", error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در به‌روزرسانی تنظیمات عمومی",
      error: error.message,
    };
  }
};

const editServicer = async (servicerID, newData) => {
  try {
    const servicer = await Servicer.findById(servicerID);
    if (servicer) {
      servicer.first_name = newData.first_name;
      servicer.last_name = newData.last_name;
      servicer.age = newData.age;
      servicer.role = newData.role;
      servicer.experience = newData.experience;
      servicer.specialty = newData.specialty;

      await servicer.save();

      return {
        success: true,
        status: 200,
        message: "خدمات دهنده مورد نظر با موفقیت ویرایش شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدمات دهنده ای برای ویرایش یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در ویرایش خدمات دهنده",
    };
  }
};

const uploadServicerImg = async (id, image) => {
  try {
    const servicer = await Servicer.findById(id);
    if (servicer) {
      servicer.imageUrl = image;
      await servicer.save();
      return {
        success: true,
        status: 200,
        message: "تصویر خدمات دهنده با موفقیت آپلود شد",
        data: servicer.imageUrl,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدمات دهنده ای یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در آپلود تصویر خدمات دهنده",
    };
  }
};

const deleteServicerImg = async (id) => {
  try {
    const servicer = await Servicer.findById(id);

    if (servicer) {
      servicer.imageUrl = "";
      await servicer.save();

      return {
        success: true,
        status: 200,
        message: "تصویر خدمات دهنده با موفقیت حذف شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خدمات دهنده ای یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در حذف تصویر خدمات دهنده",
    };
  }
};

module.exports = {
  usersList,
  usersCount,
  adminsList,
  allReserves,
  activeReserves,
  doneReserves,
  cancelReserve,
  totalRevenue,
  changeStatus,
  canceledReserves,
  upgradeUser,
  deleteUser,
  descentAdmin,
  deleteService,
  addService,
  addServicer,
  deleteServicer,
  changeWorkTimes,
  setReply,
  deleteComment,
  setPortfolio,
  getPortfolio,
  activeUsers,
  inactiveUsers,
  newUsers,
  editService,
  changeServiceImg,
  deleteServicePortfolio,
  getGeneralSettingsInfo,
  updateGeneralSettings,
  editServicer,
  uploadServicerImg,
  deleteServicerImg,
};