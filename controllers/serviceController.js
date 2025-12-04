const serviceModel = require("../models/Service.js");

// create new service by admin
const createService = async (req, res) => {
  const serviceData = req.body;
  if (serviceData) {
    const createResult = await serviceModel.create(serviceData);
    if (createResult) {
      return res.status(201).json({
        message: "خدمات با موفقیت ایجاد شد",
        data: createResult,
      });
    } else {
      return res.status(400).json({
        message:
          "خطایی در ایجاد خدمات رخ داد! لطفا اطلاعات را به درستی وارد کنید",
      });
    }
  }
};

// get services list
const getServices = async (req, res) => {
  const getResult = await serviceModel.get();
  if (getResult) {
    return res.status(200).json({
      message: "لیست خدمات با موفقیت دریافت شد",
      data: getResult,
    });
  }
};

module.exports = { createService, getServices };
