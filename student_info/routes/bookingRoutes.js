import express from "express";
import bookingController from "../controllers/bookingController.js";
const router = express.Router();

router.post("/bookBus",bookingController.bookBus);

router.get("/getBookings/:id",bookingController.getBookings);

export default {router};