const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const userPanelController = require("../controllers/userPanelController.js");
const reserveController = require("../controllers/reserveController.js");
const commentController = require("../controllers/commentController.js");
const upload = require("../middlewares/upload.js");

// resrve routes📅
router.get("/my-reserves", auth, reserveController.getMyReserves);
router.delete("/cancel-myReserve", auth, reserveController.cancelReserve);
router.post(
  "/register-reservation",
  auth,
  reserveController.registerReservation
);

// user panel routes👤
router.get("/my-panel", auth, userPanelController.getUserPanel);
router.post("/edit-myInfo", auth, userPanelController.editMyInfo);
router.delete("/delete-profile", auth, userPanelController.deleteProfile);
router.post(
  "/upload-image",
  auth,
  upload.single("image"),
  userPanelController.uploadImage
);

// comment routes💬
router.post("/user-comment", auth, commentController.createComment);

// role routes 🔑
router.get("/role", auth, userPanelController.getUserRole);

module.exports = router;
