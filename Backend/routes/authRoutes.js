const express = require("express");
const router = express.Router();
const { signup, login, getMe,logout,forgotPassword,resetPassword,verifyOTP } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout);
router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp",verifyOTP);


module.exports = router;
