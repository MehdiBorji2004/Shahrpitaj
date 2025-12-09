const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const commentController = require("../controllers/commentController.js");
const serviceController = require("../controllers/serviceController.js");
const servicerController = require("../controllers/servicerController.js");
const reserveController = require("../controllers/reserveController.js");
const adminPanelController = require("../controllers/adminPanelController.js");

// services routes🛠
router.get("/services-list", serviceController.getServices);
router.post("/new-service", serviceController.createService);

// servicers routes👤
router.post("/new-servicer", servicerController.createServicer);
router.get("/servicers-list", servicerController.getServicers);

// users routes👥
router.get("/users-count", adminPanelController.getUsersCount);

// reserve routes📅
router.get("/reserved-times", reserveController.getReservedTimes);

// comment routes💬
router.get("/comments-list", commentController.getComments);

// worktime routes⌚
router.get("/get-work-times", reserveController.getWorkTimes);

// portfolio routes🖼
router.get("/portfolio-list", adminPanelController.getPortfolioImages);

// register routes📝
router.post("/signup", registerController.signup);
router.post("/verify-signup", registerController.verifySignup);
router.post("/login", registerController.login);
router.post("/verify-login", registerController.verifyLogin);
router.post("/resend-otp", registerController.resendOtp);

// general settings routes⚙️
router.get(
  "/general-settings-info",
  adminPanelController.getGeneralSettingsInfo
);

module.exports = router;
