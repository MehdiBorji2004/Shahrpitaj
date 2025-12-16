const userPanelModel = require("../models/UserPanel");
require("dotenv").config();

const getUserRole = async (req, res) => {
  const id = req.user.id;
  const getResult = await userPanelModel.userRole(id);
  if (getResult.success) {
    return res.status(getResult.status).json({
      data: getResult.data,
    });
  } else {
    return res.status(getResult.status).json({
      message: getResult.message,
    });
  }
};

const getUserPanel = async (req, res) => {
  const id = req.user.id;
  // اعتبارسنجی وجود کاربر
  if (!id) {
    return res.status(404).json({
      message: "اطلاعات کاربر یافت نشد! ابتدا وارد حساب کاربری خود شوید",
    });
  } else {
    const getResult = await userPanelModel.getPanel(id);

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
  }
};

const editMyInfo = async (req, res) => {
  const id = req.user.id;
  const userNewData = req.body;

  if (id && userNewData) {
    const editResult = await userPanelModel.editInfo(id, userNewData);
    if (editResult.success) {
      return res.status(editResult.status).json({
        message: editResult.message,
        data: editResult.data,
      });
    } else {
      return res.status(editResult.status).json({
        message: editResult.message,
      });
    }
  }
};

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لطفاً یک عکس آپلود کنید" });
  }
  const userID = req.user.id;
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  if (imageUrl && userID) {
    const uploadResult = await userPanelModel.uploadImage(imageUrl, userID);

    if (uploadResult.success) {
      return res.status(uploadResult.status).json({
        message: uploadResult.message,
      });
    } else {
      return res.status(uploadResult.status).json({
        message: uploadResult.message,
      });
    }
  }
};

const deleteProfile = async (req, res) => {
  const userID = req.user.id;
  if (userID) {
    const deleteResult = await userPanelModel.deleteProfile(userID);
    if (deleteResult.success) {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
      });
    } else {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "آیدی ارسال نشده است ❌",
    });
  }
};

module.exports = {
  getUserRole,
  getUserPanel,
  editMyInfo,
  uploadImage,
  deleteProfile,
};
