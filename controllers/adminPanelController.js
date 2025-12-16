const adminPanelModel = require("../models/AdminPanel.js");
require("dotenv").config();

const parseDateString = (date) => {
  const [year, month, day] = date.split("-");
  return { year, month, day };
};

const getUsersList = async (req, res) => {
  const { startDate, endDate } = req.query;

  const getResult = await adminPanelModel.usersList(startDate, endDate);
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

const getUsersCount = async (req, res) => {
  const getResult = await adminPanelModel.usersCount();
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

const getAdminsList = async (req, res) => {
  const getResult = await adminPanelModel.adminsList();
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

const getAllReserves = async (req, res) => {
  const { startDate, endDate } = req.query;
  const startDateParsed = startDate ? parseDateString(startDate) : null;
  const endDateParsed = endDate ? parseDateString(endDate) : null;

  const getResult = await adminPanelModel.allReserves(
    startDateParsed,
    endDateParsed
  );
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

const getActiveReserves = async (req, res) => {
  const { startDate, endDate } = req.query;

  const startDateParsed = startDate ? parseDateString(startDate) : null;
  const endDateParsed = endDate ? parseDateString(endDate) : null;

  const getResult = await adminPanelModel.activeReserves(
    startDateParsed,
    endDateParsed
  );
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

const getDoneReserves = async (req, res) => {
  const { startDate, endDate } = req.query;
  const startDateParsed = parseDateString(startDate);
  const endDateParsed = parseDateString(endDate);

  const getResult = await adminPanelModel.doneReserves(
    startDateParsed,
    endDateParsed
  );
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

const getCanceledReserves = async (req, res) => {
  const getResult = await adminPanelModel.canceledReserves();
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

const getTotalRevenue = async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate)
    return res.status(400).json({ message: "خطا در دریافت تاریخ انتخاب شده" });

  const startDateParsed = parseDateString(startDate);
  const endDateParsed = parseDateString(endDate);

  const getResult = await adminPanelModel.totalRevenue(
    startDateParsed,
    endDateParsed
  );
  if (getResult.success) {
    return res.status(getResult.status).json({
      message: getResult.message,
      data: getResult.data,
    });
  } else {
    return res.json({
      data: getResult.data,
    });
  }
};

const changeReserveStatus = async (req, res) => {
  const { id } = req.body;
  if (id) {
    const changeResult = await adminPanelModel.changeStatus(id);
    if (changeResult.success) {
      return res.status(changeResult.status).json({
        message: changeResult.message,
        data: changeResult.data,
      });
    } else {
      return res.status(changeResult.status).json({
        message: changeResult.message,
      });
    }
  }
};

const cancelActiveReserve = async (req, res) => {
  const { id } = req.query;
  if (id) {
    const cancelResult = await adminPanelModel.cancelReserve(id);
    if (cancelResult.success) {
      return res.status(cancelResult.status).json({
        message: cancelResult.message,
      });
    }
  }
};

const upgradeUserRole = async (req, res) => {
  const { userID } = req.body;
  if (userID) {
    const upgradeResult = await adminPanelModel.upgradeUser(userID);
    if (upgradeResult.success) {
      return res.status(upgradeResult.status).json({
        message: upgradeResult.message,
        data: upgradeResult.data,
      });
    } else {
      return res.status(upgradeResult.status).json({
        message: upgradeResult.message,
      });
    }
  } else {
    return res.status(400).json({ message: "آیدی کاربر ارسال نشده است" });
  }
};

const deleteUser = async (req, res) => {
  const { userID } = req.query;
  if (userID) {
    const deleteResult = await adminPanelModel.deleteUser(userID);
    if (deleteResult.success) {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
        data: deleteResult.data,
      });
    } else {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
      });
    }
  } else {
    return res.status(400).json({ message: "آیدی کاربر ارسال نشده است" });
  }
};

const descentAdmin = async (req, res) => {
  const { adminID } = req.body;
  if (adminID) {
    const descentResult = await adminPanelModel.descentAdmin(adminID);
    if (descentResult.success) {
      return res.status(descentResult.status).json({
        message: descentResult.message,
        data: descentResult.data,
      });
    } else {
      return res.status(descentResult.status).json({
        message: descentResult.message,
      });
    }
  } else {
    return res.status(400).json({ message: "آیدی ادمین ارسال نشده است" });
  }
};

const deleteService = async (req, res) => {
  const { serviceID } = req.query;
  if (serviceID) {
    const deleteResult = await adminPanelModel.deleteService(serviceID);
    if (deleteResult.success) {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
        data: deleteResult.data,
      });
    } else {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
      });
    }
  } else {
    return res.status(400).json({ message: "آیدی خدمات ارسال نشده است" });
  }
};

const addNewService = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لطفاً یک عکس آپلود کنید" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  const { serviceName, serviceDetails, servicePrice, servicePath } = req.body;
  if (
    serviceName &&
    serviceDetails &&
    servicePrice &&
    servicePath &&
    imageUrl
  ) {
    const addResult = await adminPanelModel.addService(
      serviceName,
      serviceDetails,
      servicePrice,
      servicePath,
      imageUrl
    );
    if (addResult.success) {
      return res.status(addResult.status).json({
        message: addResult.message,
        data: addResult.data,
      });
    } else {
      return res.status(addResult.status).json({
        message: addResult.message,
      });
    }
  } else {
    return res
      .status(400)
      .json({ message: "اطلاعات کامل برای خدمات جدید ارسال نشده است ❌" });
  }
};

const addNewServicer = async (req, res) => {
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : "";

  const servicerData = req.body;
  if (servicerData) {
    const addResult = await adminPanelModel.addServicer(servicerData, imageUrl);
    if (addResult.success) {
      return res.status(addResult.status).json({
        message: addResult.message,
        data: addResult.data,
      });
    } else {
      return res.status(addResult.status).json({
        message: addResult.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "اطلاعات کامل برای خدمات دهنده جدید ارسال نشده است ❌",
    });
  }
};

const deleteServicer = async (req, res) => {
  const { servicerID } = req.query;
  if (servicerID) {
    const deleteResult = await adminPanelModel.deleteServicer(servicerID);
    if (deleteResult.success) {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
        data: deleteResult.data,
      });
    } else {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
      });
    }
  } else {
    return res.status(400).json({ message: "آیدی خدمات دهنده ارسال نشده است" });
  }
};

const changeWorkTimes = async (req, res) => {
  const { startHour, endHour, duration } = req.body;
  if (startHour && endHour && duration) {
    const changeResult = await adminPanelModel.changeWorkTimes(
      startHour,
      endHour,
      duration
    );

    if (changeResult.success) {
      return res.status(changeResult.status).json({
        message: changeResult.message,
        data: changeResult.data,
      });
    } else {
      return res.status(changeResult.status).json({
        message: changeResult.message,
      });
    }
  } else {
    return res
      .status(400)
      .json({ message: "لطفا مقادیر را به درستی وارد نمایید ❌" });
  }
};

const replyComment = async (req, res) => {
  const adminID = req.user.id;
  const { formData, commentID } = req.body;
  const { adminReply } = formData;
  if (adminID && adminReply && commentID) {
    const result = await adminPanelModel.setReply(
      adminID,
      adminReply,
      commentID
    );
    if (result.success) {
      return res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(result.status).json({
        message: result.message,
      });
    }
  } else {
    return res
      .status(400)
      .json({ message: "آیدی کاربر یا پاسخ ارسال نشده است ❌" });
  }
};

const deleteComment = async (req, res) => {
  const { commentID } = req.query;
  if (commentID) {
    const deleteResult = await adminPanelModel.deleteComment(commentID);
    if (deleteResult.success) {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
        data: deleteResult.data,
      });
    } else {
      return res.status(deleteResult.status).json({
        message: deleteResult.message,
      });
    }
  } else {
    return res.status(400).json({ message: "آیدی کامنت ارسال نشده است ❌" });
  }
};

const setPortfolioImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ message: "لطفاً حداقل یک عکس آپلود کنید ❌" });
  }
  const { serviceID } = req.body;
  const files = req.files;
  const imagesUrl = files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  });

  const setResult = await adminPanelModel.setPortfolio(serviceID, imagesUrl);
  if (setResult.success) {
    return res.status(setResult.status).json({
      message: setResult.message,
    });
  } else {
    return res.status(setResult.status).json({
      message: setResult.message,
    });
  }
};

const getPortfolioImages = async (req, res) => {
  const { serviceID } = req.query;
  if (serviceID) {
    const getResult = await adminPanelModel.getPortfolio(serviceID);
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
  } else {
    return res.status(400).json({
      message: "آیدی خدمات ارسال نشده است ❌",
    });
  }
};

const getActiveUsers = async (req, res) => {
  const getResult = await adminPanelModel.activeUsers();
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

const getInactiveUsers = async (req, res) => {
  const getResult = await adminPanelModel.inactiveUsers();
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

const getNewUsers = async (req, res) => {
  const getResult = await adminPanelModel.newUsers();
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

const editService = async (req, res) => {
  const { serviceID, newData } = req.body;
  if (serviceID && newData) {
    const editResult = await adminPanelModel.editService(serviceID, newData);
    if (editResult.success) {
      return res
        .status(editResult.status)
        .json({ message: editResult.message });
    } else {
      return res
        .status(editResult.status)
        .json({ message: editResult.message });
    }
  }
};

const changeServiceImg = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لطفاً یک عکس آپلود کنید" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  const { serviceID } = req.body;
  if (imageUrl && serviceID) {
    const changeResult = await adminPanelModel.changeServiceImg(
      imageUrl,
      serviceID
    );
    if (changeResult.success) {
      return res
        .status(changeResult.status)
        .json({ message: changeResult.message });
    } else {
      return res
        .status(changeResult.status)
        .json({ message: changeResult.message });
    }
  }
};

const deleteServicePortfolio = async (req, res) => {
  const { serviceID, imageUrl } = req.query;
  if (serviceID && imageUrl) {
    const deleteResult = await adminPanelModel.deleteServicePortfolio(
      serviceID,
      imageUrl
    );
    if (deleteResult.success) {
      return res
        .status(deleteResult.status)
        .json({ message: deleteResult.message });
    } else {
      return res
        .status(deleteResult.status)
        .json({ message: deleteResult.message });
    }
  } else {
    return res
      .status(400)
      .json({ message: "آیدی نمونه کار ارسال نشده است ❌" });
  }
};

const getGeneralSettingsInfo = async (req, res) => {
  const getResult = await adminPanelModel.getGeneralSettingsInfo();
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

const updateGeneralSettings = async (req, res) => {
  const { settings } = req.body;

  const updateResult = await adminPanelModel.updateGeneralSettings(settings);
  if (updateResult.success) {
    return res.status(updateResult.status).json({
      message: updateResult.message,
    });
  } else {
    return res.status(updateResult.status).json({
      message: updateResult.message,
    });
  }
};

const editServicerInfo = async (req, res) => {
  const { servicerID, newData } = req.body;

  if (servicerID && newData) {
    const editResult = await adminPanelModel.editServicer(servicerID, newData);
    if (editResult.success) {
      return res
        .status(editResult.status)
        .json({ message: editResult.message });
    } else {
      return res
        .status(editResult.status)
        .json({ message: editResult.message });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "اطلاعات خدمات دهنده ارسال نشده است ❌",
    });
  }
};

const uploadServicerImg = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لطفاً یک عکس آپلود کنید" });
  }

  const { servicerID } = req.body;
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : "";

  if (servicerID && imageUrl) {
    const uploadResult = await adminPanelModel.uploadServicerImg(
      servicerID,
      imageUrl
    );

    if (uploadResult.success) {
      return res
        .status(uploadResult.status)
        .json({ data: uploadResult.data, message: uploadResult.message });
    } else {
      return res
        .status(uploadResult.status)
        .json({ message: uploadResult.message });
    }
  } else {
    return res
      .status(400)
      .json({ message: "آیدی خدمات دهنده یا تصویر آن ارسال نشده است!" });
  }
};

const deleteServicerImg = async (req, res) => {
  const { servicerID } = req.query;
  if (servicerID) {
    const deleteResult = await adminPanelModel.deleteServicerImg(servicerID);

    if (deleteResult.success) {
      return res
        .status(deleteResult.status)
        .json({ message: deleteResult.message });
    } else {
      return res
        .status(deleteResult.status)
        .json({ message: deleteResult.message });
    }
  } else {
    return res
      .status(400)
      .json({ message: "آیدی خدمات دهنده ارسال نشده است!" });
  }
};

module.exports = {
  getUsersList,
  getUsersCount,
  getAdminsList,
  getAllReserves,
  getActiveReserves,
  getDoneReserves,
  getCanceledReserves,
  getTotalRevenue,
  changeReserveStatus,
  cancelActiveReserve,
  upgradeUserRole,
  deleteUser,
  descentAdmin,
  deleteService,
  addNewService,
  addNewServicer,
  deleteServicer,
  changeWorkTimes,
  replyComment,
  deleteComment,
  setPortfolioImages,
  getPortfolioImages,
  getActiveUsers,
  getInactiveUsers,
  getNewUsers,
  editService,
  changeServiceImg,
  deleteServicePortfolio,
  getGeneralSettingsInfo,
  updateGeneralSettings,
  editServicerInfo,
  uploadServicerImg,
  deleteServicerImg,
};
