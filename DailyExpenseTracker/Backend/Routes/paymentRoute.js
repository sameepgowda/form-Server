import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import handlePaymentController from "../Controllers/handlePaymentController.js";

const router = express.Router();

router.post("/createPaymentOrder", authMiddleware, handlePaymentController.createPaymentOrder);

router.post("/verifyPayment",authMiddleware,handlePaymentController.verifyPayment);
export default router;