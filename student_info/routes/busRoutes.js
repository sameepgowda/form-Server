import busController from "../controllers/busController.js";
import express from  "express";

const router = express.Router();

router.post("/",busController.addBus);

export default {router};