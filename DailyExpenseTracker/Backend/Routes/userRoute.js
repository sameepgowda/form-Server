import express from "express";
import userController from "../Controllers/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";


const router = express.Router();

router.post("/createUser", userController.createUser);

router.post("/login", userController.userLogin);

router.get("/getLeaderBoardData", authMiddleware, userController.getLeaderBoardData);

export default router;