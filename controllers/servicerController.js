const servicerModel = require("../models/Servicer.js");

// create new servicer by admin
const createServicer = async (req, res) => {
  const servicerData = req.body;
  if (servicerData) {
    const addResult = await servicerModel.create(servicerData);
    if (addResult) {
      return res.status(201).json({
        message: "خدمات دهنده جدید با موفقیت ثبت شد ✅",
        data: addResult,
      });
    } else {
      return res.status(400).json({
        message: "خدمات دهنده ای با این مشخصات از قبل وجود دارد ❌",
      });
    }
  }
};

// get servicers list
const getServicers = async (req, res) => {
  const getResult = await servicerModel.get();
  if (getResult) {
    return res.status(200).json({
      message: "لیست خدمات دهنده ها با موفقیت دریافت شد ✅",
      data: getResult,
    });
  } else {
    return res.status(404).json({
      message: "لیست خدمات دهنده ها پیدا نشد. لطفا دوباره امتحان کنید ❌",
    });
  }
};

module.exports = { createServicer, getServicers };
