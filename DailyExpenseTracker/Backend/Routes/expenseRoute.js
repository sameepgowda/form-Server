import express from "express";
import expenseController  from "../Controllers/expenseController.js";

const router = express.Router();


router.post("/addExpense",expenseController.addExpense);

router.post("/getDailyBalance", expenseController.getDailyBalance);

router.post("/getMonthlyReport",expenseController.getMonthlyReport);

router.post("/deleteExpense", expenseController.deleteExpense);

router.post("/bulkDeleteExpense", expenseController.bulkDeleteExpense);

router.post("/getYearlyReport",expenseController.getYearlyReport);


export default router;