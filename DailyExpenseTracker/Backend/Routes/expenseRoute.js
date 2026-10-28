import express from "express";
import expenseController  from "../Controllers/expenseController.js";

const router = express.Router();


router.post("/addExpense",expenseController.addExpense);

router.post("/getDailyBalance", expenseController.getDailyBalance);

router.post("/getMonthlyReport",expenseController.getMonthlyReport);


export default router;