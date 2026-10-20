import userController from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.post("/insertUser",userController.insertUser);

router.post("/updateUser",userController.updateUser);

router.delete("/deleteUser/:id",userController.deleteUser);

export default {router};