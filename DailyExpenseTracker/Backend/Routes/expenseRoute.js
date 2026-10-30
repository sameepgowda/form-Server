import express from "express";
import expenseController  from "../Controllers/expenseController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();


router.post("/addExpense",authMiddleware,expenseController.addExpense);

router.post("/editExpense", authMiddleware, expenseController.editExpense)

router.post("/getDailyBalance", authMiddleware, expenseController.getDailyBalance);

router.post("/getMonthlyReport",authMiddleware,expenseController.getMonthlyReport);

router.delete("/deleteExpense/:id", authMiddleware, expenseController.deleteExpense);

router.post("/bulkDeleteExpense",authMiddleware, expenseController.bulkDeleteExpense);

router.post("/getYearlyReport",authMiddleware,expenseController.getYearlyReport);


export default router;