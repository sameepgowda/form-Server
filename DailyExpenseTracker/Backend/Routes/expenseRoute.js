import express from "express";
import expenseController  from "../Controllers/expenseController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import generateMonthlyReport from "../Controllers/generateMonthlyReport.js";

const router = express.Router();


router.post("/addExpense",authMiddleware,expenseController.addExpense);

router.post("/editExpense", authMiddleware, expenseController.editExpense);

router.post("/generateCategoryUsingAI", authMiddleware, expenseController.generateCategoryUsingAI )

router.post("/getDailyBalance", authMiddleware, expenseController.getDailyBalance);

router.post("/getMonthlyReport",authMiddleware,expenseController.getMonthlyReport);

router.delete("/deleteExpense/:id", authMiddleware, expenseController.deleteExpense);

router.get("/getYearlyReport/:year",authMiddleware, expenseController.getYearlyReport);

router.post("/generateMonthlyReport", authMiddleware, generateMonthlyReport.downloadExpenses );


export default router;