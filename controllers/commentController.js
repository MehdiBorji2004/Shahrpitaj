const commentModel = require("../models/Comment.js");

const createComment = async (req, res) => {
  const commentData = req.body;
  const userID = req.user.id;
  if (commentData && userID) {
    const commentResult = await commentModel.create(commentData, userID);
    if (commentResult) {
      return res.status(201).json({
        message: "نظر شما با موفقیت ثبت شد ✅",
        data: commentResult,
      });
    }
  } else {
    return res.status(400).json({
      message: "خطا در ثبت نظر. لطفا اطلاعات را بررسی کنید ❌",
    });
  }
};

const getComments = async (req, res) => {
  const getResult = await commentModel.commentsList();
  if (getResult.success) {
    return res.status(getResult.status).json({
      message: getResult.message,
      data: getResult.data,
    });
  } else {
    return res.status(getResult.status).json({
      message: getResult.message,
    });
  }
};

module.exports = { createComment, getComments };
