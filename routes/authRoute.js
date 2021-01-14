import express from "express";
import authController from "../controllers/authController";
const router = express.Router();

// auth Routes

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/verify/:token", authController.confirmEmail);
router.post("/forgot", authController.forgotPassword);
router.post("/reset/:token", authController.resetPassword);
router.post("/logout", authController.logout);

export default router;
