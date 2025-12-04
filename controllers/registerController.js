const registerModel = require("../models/Register.js");

const signup = async (req, res) => {
  const userData = req.body;
  if (userData) {
    const addResult = await registerModel.signupUser(userData);
    if (addResult.success) {
      return res.status(addResult.status).json({
        message: addResult.message,
      });
    } else {
      return res.status(addResult.status).json({
        message: addResult.message,
      });
    }
  }
};

const verifySignup = async (req, res) => {
  const { phone, otp } = req.body;
  if (phone && otp) {
    const verifyResult = await registerModel.verify(phone, otp, false);

    if (verifyResult.success) {
      return res.status(verifyResult.status).json({
        message: verifyResult.message,
        token: verifyResult.token,
        data: verifyResult.data,
      });
    } else {
      return res.status(verifyResult.status).json({
        message: verifyResult.message,
      });
    }
  }
};

const login = async (req, res) => {
  const { phone } = req.body;
  if (phone) {
    const loginResult = await registerModel.loginUser(phone);
    if (loginResult.success) {
      return res.status(loginResult.status).json({
        message: loginResult.message,
      });
    } else {
      return res.status(loginResult.status).json({
        message: loginResult.message,
      });
    }
  }
};

const verifyLogin = async (req, res) => {
  const { phone, otp } = req.body;
  if (phone && otp) {
    const verifyResult = await registerModel.verify(phone, otp, true);

    if (verifyResult.success) {
      return res.status(verifyResult.status).json({
        message: verifyResult.message,
        token: verifyResult.token,
        data: verifyResult.data,
      });
    } else {
      return res.status(verifyResult.status).json({
        message: verifyResult.message,
      });
    }
  }
};

const resendOtp = async (req, res) => {
  const { phone } = req.body;
  if (phone) {
    const resendResult = await registerModel.resend(phone);
    if (resendResult.success) {
      return res.status(resendResult.status).json({
        message: resendResult.message,
      });
    } else {
      return res.status(resendResult.status).json({
        message: resendResult.message,
      });
    }
  }
};

module.exports = { signup, verifySignup, login, verifyLogin, resendOtp };
