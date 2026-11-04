import { Op, fn, col } from "sequelize";
import { ExpenseData, User } from "../../Database/index.js";
import { sequelize } from "../../Database/db.js";
import geminiAiService from "../Services/geminiAiService.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Amount of money spent: positive for a debit (negative amount), 0 for a credit
const getDebitAmount = (expenseAmount) => (expenseAmount < 0 ? -expenseAmount : 0);

// Add (or, with a negative amount, subtract) from the user's running total expense
const adjustTotalExpense = async (UserId, amount, transaction) => {
  if (!amount) return;

  await User.increment("totalExpense", {
    by: amount,
    where: { id: UserId },
    transaction,
  });
};

// Split rows into income (amount > 0) and expense (amount < 0)
const splitIncomeAndExpense = (rows) => ({
  incomeRows: rows.filter((row) => Number(row.expenseAmount) > 0),
  expenseRows: rows.filter((row) => Number(row.expenseAmount) < 0),
});

const sumAmounts = (rows) =>
  rows.reduce((total, row) => total + Number(row.expenseAmount), 0);

const omitUserId = ({ UserId, ...rest }) => rest;

// Monthly SUM(expenseAmount) for one year, limited to credits or debits
const findMonthlySums = (UserId, startDate, endDate, amountCondition, alias) =>
  ExpenseData.findAll({
    attributes: [
      [fn("MONTH", col("date")), "month"],
      [fn("SUM", col("expenseAmount")), alias],
    ],
    where: {
      UserId,
      date: { [Op.gte]: startDate, [Op.lte]: endDate },
      expenseAmount: amountCondition,
    },
    group: [fn("MONTH", col("date"))],
    order: [[fn("MONTH", col("date")), "desc"]],
    raw: true,
  });

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------

const addExpense = async (req, res, next) => {
  const { date, category, description, notes } = req.body;
  const UserId = req.UserId;
  const expenseAmount = Number(req.body.expenseAmount);

  if (!(UserId && date && expenseAmount && category)) {
    return res.status(400).json({ message: "Bad request" });
  }

  const transaction = await sequelize.transaction();
  try {
    const expense = await ExpenseData.create(
      { UserId, date, category, expenseAmount, description, notes },
      { transaction },
    );

    // Only debits count towards the user's total expense
    await adjustTotalExpense(UserId, getDebitAmount(expenseAmount), transaction);

    await transaction.commit();
    res.status(201).json({
      message: "Expense added successfully",
      expenseInfo: {
        expenseId: expense.id,
        date,
        category,
        expenseAmount,
        description,
      },
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const editExpense = async (req, res, next) => {
  const { id, date, category, description, notes } = req.body;
  const UserId = req.UserId;
  const expenseAmount = Number(req.body.expenseAmount);

  if (!(UserId && date && expenseAmount && category)) {
    return res.status(400).json({ message: "Bad request" });
  }

  const transaction = await sequelize.transaction();
  try {
    const existingExpense = await ExpenseData.findOne({
      where: { id, UserId },
      raw: true,
      transaction,
    });

    if (!existingExpense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    // Change in the user's total expense = new debit - old debit.
    // This covers debit -> debit, debit -> credit, credit -> debit and
    // credit -> credit (no change) in one go.
    const totalExpenseChange =
      getDebitAmount(expenseAmount) -
      getDebitAmount(Number(existingExpense.expenseAmount));

    await adjustTotalExpense(UserId, totalExpenseChange, transaction);

    await ExpenseData.update(
      { category, expenseAmount, description, notes },
      { where: { id, UserId }, transaction },
    );

    await transaction.commit();
    res.status(201).json({
      message: "Expense updated successfully",
      expenseInfo: {
        id,
        date,
        category,
        expenseAmount,
        description,
        notes,
      },
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const getDailyBalance = async (req, res) => {
  const UserId = req.UserId;
  const { date } = req.body;

  if (!(UserId && date)) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const incomeExpenseData = await ExpenseData.findAll({
      where: { UserId, date },
      raw: true,
    });

    const { incomeRows, expenseRows } = splitIncomeAndExpense(incomeExpenseData);

    

    res.status(200).json({
      totalIncome: sumAmounts(incomeRows),
      totalExpense: sumAmounts(expenseRows),
      incomeData: incomeRows.map(omitUserId),
      expenseData: expenseRows.map(omitUserId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const UserId = req.UserId;

  if (!(id && UserId)) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const transaction = await sequelize.transaction();
  try {
    // Only the owner can delete an expense
    const expense = await ExpenseData.findOne({
      where: { id, UserId },
      raw: true,
      transaction,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    // Deleting a debit lowers the user's total expense
    await adjustTotalExpense(
      UserId,
      -getDebitAmount(Number(expense.expenseAmount)),
      transaction,
    );

    await ExpenseData.destroy({ where: { id, UserId }, transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Expense successfully deleted",
      expenseInfo: { expenseId: id },
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    next(err);
  }
};

const getMonthlyReport = async (req, res) => {
  const UserId = req.UserId;
  const month = Number(req.body.month);
  const year = Number(req.body.year);

  if (!(UserId && month && year)) {
    return res.status(400).json({ message: "bad request" });
  }

  try {
    // First day of the month up to (but not including) the first day of the next
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate =
      month < 12
        ? `${year}-${String(month + 1).padStart(2, "0")}-01`
        : `${year + 1}-01-01`;

    const monthlyExpenseData = await ExpenseData.findAll({
      where: {
        UserId,
        date: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      order: [
        ["date", "desc"],
        ["id", "asc"],
      ],
      raw: true,
    });

    const { incomeRows, expenseRows } = splitIncomeAndExpense(monthlyExpenseData);
    const monthlyExpenseDataRes = monthlyExpenseData.map(({UserId,...rest})=>rest)

    res.status(200).json({
      totalMonthlyIncome: sumAmounts(incomeRows),
      totalMonthlyExpense: sumAmounts(expenseRows),
      monthlyExpenseData:monthlyExpenseDataRes,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getYearlyReport = async (req, res) => {
  const UserId = req.UserId;

  if (!(UserId && req.params.year)) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const year = Number(req.params.year);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const [monthlyExpense, monthlyCredit] = await Promise.all([
      findMonthlySums(UserId, startDate, endDate, { [Op.lt]: 0 }, "totalExpense"),
      findMonthlySums(UserId, startDate, endDate, { [Op.gt]: 0 }, "totalCredit"),
    ]);

     const totalExpenseOftheYear = -(monthlyExpense.reduce(
        (accum, obj) => accum + Number(obj.totalExpense),
        0,
      ));

      const totalIncomeOftheYear = monthlyCredit.reduce(
        (accum, obj) => accum + Number(obj.totalCredit),
        0,
      );
    const totalSavings = totalIncomeOftheYear - totalExpenseOftheYear;

    // December down to January, skipping months without any transactions
    const monthlyTransactionData = [];
    for (let month = 12; month >= 1; month--) {
        let totalMonthlyExpense = 0;
        let totalMonthlyCredit = 0;
        let totalMonthlySavings = 0;
        const obj1 = monthlyExpense.find((obj) => obj.month == month);

        if (obj1) {
          totalMonthlyExpense = Number(obj1.totalExpense);
        }
        const obj2 = monthlyCredit.find((obj) => obj.month == month);

        if (obj2) {
          totalMonthlyCredit = Number(obj2.totalCredit);
        }
        totalMonthlySavings = totalMonthlyExpense + totalMonthlyCredit;
        if (totalMonthlyCredit != 0 || totalMonthlyExpense != 0) {
          monthlyTransactionData.push({
            month,
            totalMonthlyCredit,
            totalMonthlyExpense,
            totalMonthlySavings,
          });
        }
    }

    return res.status(200).json({
      monthlyTransactionData,
      totalExpenseOftheYear,
      totalIncomeOftheYear,
      totalSavings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const generateCategoryUsingAI = async (req, res, next) => {
  const { description } = req.body;
  const UserId = req.UserId;

  if (!(UserId && description)) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const response = await geminiAiService.ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate an appropriate one word category to be entered in an 
            expense tracker for the following expense/credit description.If
             a category is present in the avaialable categories, just use that otherwise generate a new category.
             Available categories:{Food,Bills,Salary,Travel,Shopping,Entertainment}, Description:${description}`,
    });

    res.status(200).json({ category: response.text });
  } catch (err) {
    next(err);
  }
};

export default {
  generateCategoryUsingAI,
  addExpense,
  getDailyBalance,
  editExpense,
  getMonthlyReport,
  deleteExpense,
  getYearlyReport,
};