import express from "express";
import studentController from "../Controllers/studentController.js";

console.log(studentController)

const router = express.Router();

router.post("/addStudent",studentController.addStudent);

router.get("/getStudents",studentController.getStudents);

export default router;