import express from "express";
import attendanceController from "../Controllers/attendanceController.js";

const router = express.Router();

router.post("/getAttandanceStatus",attendanceController.getAttendanceStatus);

router.get("/getAttandanceReport",attendanceController.getAttendanceReport);

router.post("/markAttendance",attendanceController.markAttendance);

export default router;