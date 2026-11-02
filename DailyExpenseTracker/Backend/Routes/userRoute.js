import express from "express";
import userController from "../Controllers/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   
    max: 5,                     
    message: { message: "Too many login attempts. Please try again after 15 minutes." },
    standardHeaders: true,     
    legacyHeaders: false
});


const router = express.Router();

router.post("/createUser", userController.createUser);

router.post("/login", loginLimiter, userController.userLogin);

router.get("/getLeaderBoardData", authMiddleware, userController.getLeaderBoardData);

router.post("/forgotPassword", userController.sendForgotPasswordLink);

router.get("/showResetForm/:token", userController.showResetForm);

router.post("/resetPassword", userController.resetPassword);

export default router;