const Comment = require("../models/schemas/commentSchema");
const User = require("./schemas/registerSchema");
const PersianDate = require("persian-date");

const persianDate = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("YYYY-MM-DD");

const persianTime = new PersianDate()
  .toLocale("en") // اعداد انگلیسی
  .format("HH:mm:ss");

const create = async (commentData, userID) => {
  try {
    const { user_comment } = commentData;
    const user = await User.findOne({ _id: userID });
    const newComment = Comment.create({
      user_firstName: user.first_name,
      user_lastName: user.last_name,
      user_profile: user.imageUrl || "",
      user_comment,
      createdAt: {
        gregorianDate: new Date(),
        solarDate: persianDate,
        time: persianTime,
      },
    });
    return newComment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const commentsList = async () => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });
    if (comments) {
      return {
        success: true,
        status: 200,
        message: "لیست کامنت ها با موفقیت دریافت شد",
        data: comments,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "هیچ کامنتی یافت نشد",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "خطای سرور در دریافت لیست کامنت ها",
    };
  }
};

module.exports = { create, commentsList };
