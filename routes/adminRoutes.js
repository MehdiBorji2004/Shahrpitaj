const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const admin = require("../middlewares/admin.js");
const upload = require("../middlewares/upload.js");
const adminPanelController = require("../controllers/adminPanelController.js");

// manage users👥 routes
router.get("/users", auth, admin, adminPanelController.getUsersList);
router.get("/active-users", auth, admin, adminPanelController.getActiveUsers);
router.get(
  "/inactive-users",
  auth,
  admin,
  adminPanelController.getInactiveUsers
);
router.get("/new-users", auth, admin, adminPanelController.getNewUsers);
router.put("/upgrade-user", auth, admin, adminPanelController.upgradeUserRole);
router.delete(
  "/delete-user",
  auth,
  admin,
  upload.single("image"),
  adminPanelController.deleteUser
);

// manage reserves routes🎗️
router.get("/all-reserves", auth, admin, adminPanelController.getAllReserves);
router.get("/doneReserves", auth, admin, adminPanelController.getDoneReserves);
router.get(
  "/activeReserves",
  auth,
  admin,
  adminPanelController.getActiveReserves
);
router.get(
  "/canceledReserves",
  auth,
  admin,
  adminPanelController.getCanceledReserves
);
router.put(
  "/done-active-reserve",
  auth,
  admin,
  adminPanelController.changeReserveStatus
);
router.delete(
  "/cancel-active-reserve",
  auth,
  admin,
  adminPanelController.cancelActiveReserve
);

// manage admins routes👤
router.get("/admins-list", auth, admin, adminPanelController.getAdminsList);
router.put("/descent-admin", auth, admin, adminPanelController.descentAdmin);

// manage services routes✂️
router.post(
  "/add-service",
  auth,
  admin,
  upload.single("image"),
  adminPanelController.addNewService
);
router.put("/edit-service", auth, admin, adminPanelController.editService);
router.put(
  "/change-service-img",
  auth,
  admin,
  upload.single("image"),
  adminPanelController.changeServiceImg
);
router.delete(
  "/delete-service",
  auth,
  admin,
  adminPanelController.deleteService
);
router.delete(
  "/delete-service-portfolio",
  auth,
  admin,
  adminPanelController.deleteServicePortfolio
);
router.post(
  "/upload-portfolio",
  auth,
  admin,
  upload.array("portfolio_image", 10),
  adminPanelController.setPortfolioImages
);

// manage servicers routes👤
router.post(
  "/add-servicer",
  auth,
  admin,
  upload.single("image"),
  adminPanelController.addNewServicer
);
router.delete(
  "/delete-servicer",
  auth,
  admin,
  adminPanelController.deleteServicer
);
router.put(
  "/edit-servicer-info",
  auth,
  admin,
  adminPanelController.editServicerInfo
);
router.post(
  "/upload-servicer-img",
  auth,
  admin,
  upload.single("image"),
  adminPanelController.uploadServicerImg
);
router.delete(
  "/delete-servicer-img",
  auth,
  admin,
  adminPanelController.deleteServicerImg
);

// manage revenue routes💵
router.get("/totalRevenue", auth, admin, adminPanelController.getTotalRevenue);

// manage comments routes💬
router.post("/reply-comment", auth, admin, adminPanelController.replyComment);
router.delete(
  "/delete-comment",
  auth,
  admin,
  adminPanelController.deleteComment
);

// manage worktime routes⌚
router.put(
  "/change-work-times",
  auth,
  admin,
  adminPanelController.changeWorkTimes
);

// manage general settings info routes⚙️

router.put(
  "/update-general-settings",
  auth,
  admin,
  adminPanelController.updateGeneralSettings
);

module.exports = router;
