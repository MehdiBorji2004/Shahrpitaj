const User = require("../models/schemas/registerSchema");

const admin = async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only!" });
  }
  next();
};

module.exports = admin;
