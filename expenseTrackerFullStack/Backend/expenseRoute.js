import expenseController from "./expenseController.js";
import express from "express";

const router = express.Router();

router.post("/addExpense",expenseController.addExpense);

router.get("/getExpenses",expenseController.getExpenses);

router.delete("/deleteExpense/:id",expenseController.deleteExpense);

export default router;