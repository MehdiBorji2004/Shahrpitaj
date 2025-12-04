const Servicer = require("./schemas/servicerSchema");

// create new servicer by admin
const create = async (servicerData) => {
  const { first_name, last_name } = servicerData;
  try {
    const isExists = await Servicer.findOne({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
    });
    if (isExists) {
      return false;
    } else {
      const newServicer = new Servicer({
        ...servicerData,
      });
      return await newServicer.save();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get servicers list
const get = async () => {
  try {
    const servicers_list = await Servicer.find({});
    if (servicers_list) {
      return servicers_list;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { create, get };
