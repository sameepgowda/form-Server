import express from "express";
import { getUser,addUser,getUsers } from "./controllers/userController.js";

const router = express.Router();

router.get("/",getUsers);

router.post("/",addUser);

router.get("/:id",getUser);

export {router};

