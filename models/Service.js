const Service = require("../models/schemas/serviceSchema");

const create = async (serviceData) => {
  try {
    const newService = new Service({
      ...serviceData,
    });
    const savedService = newService.save();
    return savedService;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get = async () => {
  try {
    const services_list = await Service.find({}).sort({ createdAt: 1 });
    return services_list;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { create, get };
