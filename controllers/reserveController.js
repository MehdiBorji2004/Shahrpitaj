const reserveModel = require("../models/Reserve.js");

const registerReservation = async (req, res) => {
  const id = req.user.id;
  if (!id) {
    return res.status(404).json({
      message: "اطلاعات کاربر یافت نشد! ابتدا وارد حساب کاربری خود شوید",
    });
  } else {
    const reservationData = req.body;
    if (reservationData) {
      const reserveResult = await reserveModel.reserve(id, reservationData);
      if (reserveResult.success) {
        return res.status(reserveResult.status).json({
          message: reserveResult.message,
          data: reserveResult,
        });
      } else {
        return res.status(reserveResult.status).json({
          message: reserveResult.message,
        });
      }
    }
  }
};

const cancelReserve = async (req, res) => {
  const {reserveID} = req.query;
  if (reserveID) {
    const cancelResult = await reserveModel.cancel(reserveID);
    if (cancelResult.success) {
      return res.status(cancelResult.status).json({
        message: cancelResult.message,
      });
    } else {
      return res.status(cancelResult.status).json({
        message: cancelResult.message,
      });
    }
  } else {
    return res.status(404).json({
      message: "id not found",
    });
  }
};

const getMyReserves = async (req, res) => {
  const id = req.user.id;
  if (id) {
    const result = await reserveModel.myReserves(id);

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
  }
};

const getReservedTimes = async (req, res) => {
  const { year, month, day, servicerName } = req.query;

  if (year && month && day && servicerName) {
    const result = await reserveModel.getTimes(year, month, day, servicerName);
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
    return res.status(404).json({
      message: "params not found",
    });
  }
};

const getWorkTimes = async (req, res) => {
  const getResult = await reserveModel.getWorkTimes();
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

module.exports = {
  registerReservation,
  cancelReserve,
  getMyReserves,
  getReservedTimes,
  getWorkTimes,
};
