import express from "express";
import userController from "../Controllers/userController.js";


const router = express.Router();

router.post("/createUser", userController.createUser);

router.post("/login", userController.userLogin);

export default router;