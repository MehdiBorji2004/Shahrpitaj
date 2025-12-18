const fs = require("fs");
const User = require("../models/schemas/registerSchema");
const Reserve = require("./schemas/reserveSchema");

const UPLOADS_DIR = "/var/www/uploads";

const userRole = async (id) => {
  try {
    const user = await User.findById(id);
    if (user) {
      return {
        success: true,
        status: 200,
        data: user.role,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "کاربری یافت نشد",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "خطای سرور در یافت کاربر",
    };
  }
};

const getPanel = async (id) => {
  try {
    // بررسی وجود کاربر در دیتابیس
    const existedUser = await User.findById(id);
    if (!existedUser) {
      return {
        success: false,
        status: 404,
        message: "کاربر مورد نظر یافت نشد!",
      };
    } else {
      // برگرداندن اطلاعات کاربر
      return {
        success: true,
        status: 200,
        message: `${existedUser.first_name} ${existedUser.last_name} به پنل کاربری خود خوش آمدید✨`,
        data: {
          existedUser,
        },
      };
    }
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return {
      success: false,
      status: 500,
      message: "خطا در دریافت اطلاعات پروفایل!",
    };
  }
};

const editInfo = async (id, userNewData) => {
  try {
    const { first_name, last_name, phone, towel_code } = userNewData;
    const user = await User.findById(id);
    const userReserve = await Reserve.findOne({ userID: id });

    // ویرایش اطلاعات کاربر با مشخصات جدید
    if (user) {
      user.first_name = first_name;
      user.last_name = last_name;
      user.phone = phone;
      user.towel_code = towel_code;
      await user.save();

      // ویرایش اطلاعات کاربر در رزرو آن با مشخصات جدید
      if (userReserve) {
        userReserve.first_name = first_name;
        userReserve.last_name = last_name;
        userReserve.phone = phone;
        await userReserve.save();
      }

      return {
        success: true,
        status: 200,
        message: "اطلاعات شما با موفقیت ویرایش شد",
        data: user,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "خطا در دریافت اطلاعات کاربر",
      };
    }
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return {
      success: false,
      status: 500,
      message: "خطا در ویرایش اطلاعات کاربر",
    };
  }
};

const uploadImage = async (imageUrl, userID) => {
  try {
    const user = await User.findById(userID);
    if (user) {
      user.imageUrl = imageUrl;
      await user.save();
      return {
        success: true,
        status: 200,
        message: "عکس شما با موفقیت آپلود شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "کاربری برای آپلود عکس یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در آپلود عکس پروفایل",
    };
  }
};

const deleteProfile = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user && user.imageUrl) {
      const filename = user.imageUrl.split("/uploads/").pop();
      const imagePath = path.join(UPLOADS_DIR, filename);

      try {
        await fs.promises.unlink(imagePath);
      } catch (err) {
        if (err.code !== "ENOENT") console.error(err);
      }

      user.imageUrl = "";
      await user.save();
      return {
        success: true,
        status: 200,
        message: "عکس پروفایل شما با موفقیت حذف شد",
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "عکس پروفایلی برای حذف یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در حذف عکس پروفایل",
    };
  }
};

module.exports = { userRole, getPanel, editInfo, uploadImage, deleteProfile };
