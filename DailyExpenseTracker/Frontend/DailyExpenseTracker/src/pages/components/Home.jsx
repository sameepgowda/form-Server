import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { load } from "@cashfreepayments/cashfree-js";

import AppHeader from './AppHeader';
import ViewTabs from './ViewTabs';
import DailyView from './DailyView';
import MonthlyView from './MonthlyView';
import YearlyView from './YearlyView';
import TransactionFormModal from './TransactionFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import PremiumModal from './PremiumModal';
import LeaderboardModal from './LeaderboardModal';
import PaymentResultModal from './PaymentResultModal';

import { getTodayDate } from './utils';
import {
    DEFAULT_DAILY_PAGE_SIZE,
    DEFAULT_MONTHLY_PAGE_SIZE
} from './constants';

// Blank Add Transaction form
const EMPTY_FORM = {
    description: '',
    transactionType: 'debit',
    amount: '',
    category: 'Food',
    notes: ''
};

function Home() {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());

    const [formData, setFormData] = useState({ ...EMPTY_FORM, id: null });

    const [transactions, setTransactions] = useState({
        incomeData: [],
        expenseData: []
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [paymentPopup, setPaymentPopup] = useState(null);
    const [showPremiumPopup, setShowPremiumPopup] = useState(false);
    const [leaderboardPopup, setLeaderboardPopup] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [categories, setCategories] = useState([
        'Food',
        'Shopping',
        'Entertainment',
        'Travel',
        'Salary',
        'Bills',
        'Health',
        'Other'
    ]);
    const [suggestingCategory, setSuggestingCategory] = useState(false);
    const [dailyTotals, setDailyTotals] = useState({
        totalIncome: 0,
        totalExpense: 0
    });

    const [activeTab, setActiveTab] = useState('daily');
    const [selectedMonth, setSelectedMonth] = useState(getTodayDate().slice(0, 7));
    const [monthlyReport, setMonthlyReport] = useState({
        totalMonthlyIncome: 0,
        totalMonthlyExpense: 0,
        monthlyExpenseData: []
    });
    const [monthlyLoading, setMonthlyLoading] = useState(true);
    const [monthlyError, setMonthlyError] = useState('');
    const monthlyRequestId = useRef(0);

    const [dailyPage, setDailyPage] = useState(1);
    const [monthlyPage, setMonthlyPage] = useState(1);

    // Rows per page chosen by the user (daily list and monthly table)
    const [dailyPageSize, setDailyPageSize] = useState(DEFAULT_DAILY_PAGE_SIZE);
    const [monthlyPageSize, setMonthlyPageSize] = useState(DEFAULT_MONTHLY_PAGE_SIZE);

    // Yearly report
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    // What is typed in the year box (committed once it is a valid 4-digit year)
    const [yearInput, setYearInput] = useState(String(new Date().getFullYear()));
    const [yearlyReport, setYearlyReport] = useState({
        monthlyTransactionData: [],
        totalExpenseOftheYear: 0,
        totalIncomeOftheYear: 0,
        totalSavings: 0
    });
    const [yearlyLoading, setYearlyLoading] = useState(true);
    const [yearlyError, setYearlyError] = useState('');
    const yearlyRequestId = useRef(0);

    // Read premium status from sessionStorage before the page renders
    const isPremium = sessionStorage.getItem("isPremium") === "true";

    const ADD_EXPENSE_API =
        "http://localhost:3000/expenseTracker/expense/addExpense";
    
    const EDIT_EXPENSE_API = "http://localhost:3000/expenseTracker/expense/editExpense";

    const GET_EXPENSES_API =
        "http://localhost:3000/expenseTracker/expense/getDailyBalance";

    const MONTHLY_REPORT_API =
        "http://localhost:3000/expenseTracker/expense/getMonthlyReport";

    // Premium subscription button click
    const handlePremiumSubscriptionClick = async () => {
        const token = sessionStorage.getItem("token");
        setPaymentPopup(null);

        try {
            const response = await axios.post(
                "http://localhost:3000/expenseTracker/payment/createPaymentOrder",
                {},
                {
                    headers: { Authorization: `${token}` }
                }
            );

            const cashfree = await load({ mode: "sandbox" });

            const checkoutOptions = {
                paymentSessionId: response.data.paymentSessionId,
                redirectTarget: document.getElementById("cf_checkout"),
                appearance: {
                    width: "425px",
                    height: "700px"
                }
            };

            // Wait for checkout to finish, then ask the backend to verify payment.
            await cashfree.checkout(checkoutOptions);

            const verificationResponse = await axios.post(
                "http://localhost:3000/expenseTracker/payment/verifyPayment",
                {
                    order_id: response.data.orderId
                },
                {
                    headers: { Authorization: `${token}` }
                }
            );

            // The verification endpoint should return success only when
            // Cashfree confirms that the order status is PAID.
            setPaymentPopup("success");

        } catch (err) {
            console.log("Payment/verification error:", err);
            setPaymentPopup("failure");
        }
    };

    // Show leaderboard (to be implemented)
    const showLeaderboard = async () => {
        const token = sessionStorage.getItem("token");
         try {
            const response = await axios.get(
                "http://localhost:3000/expenseTracker/user/getLeaderBoardData",
                {
                    headers: { Authorization: `${token}` }
                }
            );

            setLeaderboardData(response.data.leaderBoardList || []);
            setLeaderboardPopup("success");
        }catch(err){
            console.log(err);
            setLeaderboardPopup("failure");
        }

    };

    // Close the premium popup immediately, then start the payment flow
    const handleBecomePremiumClick = () => {
        setShowPremiumPopup(false);
        handlePremiumSubscriptionClick();
    };

    const suggestCategory = async () =>{
        if (!formData.description.trim()) {
            alert("Please enter a description first.");
            return;
        }

        try{
            setSuggestingCategory(true);

             const token = sessionStorage.getItem("token");
        const payload = {description:formData.description};
        const response = await axios.post("http://localhost:3000/expenseTracker/expense/generateCategoryUsingAI",
           payload , {
                    headers: { Authorization: `${token}` }
                }
        );
        const suggestedCategory = String(response.data.category || '').trim();

            if (suggestedCategory) {
                // Reuse the existing category if it is already in the list
                const existingCategory = categories.find(
                    (category) =>
                        category.toLowerCase() === suggestedCategory.toLowerCase()
                );

                if (existingCategory) {
                    setFormData(prev => ({
                        ...prev,
                        category: existingCategory
                    }));
                } else {
                    // Otherwise add the new category to the list and select it
                    setCategories(prev => [...prev, suggestedCategory]);

                    setFormData(prev => ({
                        ...prev,
                        category: suggestedCategory
                    }));
                }
            }
        }catch(err){
            console.log(err);
            alert("Unable to suggest a category. Please try again.");
        }finally{
            setSuggestingCategory(false);
        }
       
    }

    // Fetch the report for the selected month
    const getMonthlyReport = async () => {
        const requestId = ++monthlyRequestId.current;

        try {
            setMonthlyLoading(true);
            setMonthlyError('');

            const token = sessionStorage.getItem("token");
            const [year, month] = selectedMonth.split('-').map(Number);

            const payload = {
                month: month,
                year: year
            };

            const response = await axios.post(
                MONTHLY_REPORT_API,
                payload,
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            // Ignore this response if the user has already moved to another month
            if (requestId !== monthlyRequestId.current) return;

            setMonthlyReport({
                totalMonthlyIncome: Number(response.data.totalMonthlyIncome) || 0,
                totalMonthlyExpense: Number(response.data.totalMonthlyExpense) || 0,
                monthlyExpenseData: response.data.monthlyExpenseData || []
            });

        } catch (err) {
            if (requestId !== monthlyRequestId.current) return;

            console.log(err);
            setMonthlyError("Unable to load the monthly report.");
            setMonthlyReport({
                totalMonthlyIncome: 0,
                totalMonthlyExpense: 0,
                monthlyExpenseData: []
            });
        } finally {
            if (requestId === monthlyRequestId.current) {
                setMonthlyLoading(false);
            }
        }
    };

    // Fetch the report for the selected year (the year is sent as a URL param)
    const getYearlyReport = async () => {
        const requestId = ++yearlyRequestId.current;

        try {
            setYearlyLoading(true);
            setYearlyError('');

            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:3000/expenseTracker/expense/getYearlyReport/${selectedYear}`,
                {
                    headers: { Authorization: `${token}` }
                }
            );

            // Ignore this response if the user has already moved to another year
            if (requestId !== yearlyRequestId.current) return;

            setYearlyReport({
                monthlyTransactionData: response.data.monthlyTransactionData || [],
                totalExpenseOftheYear: Number(response.data.totalExpenseOftheYear) || 0,
                totalIncomeOftheYear: Number(response.data.totalIncomeOftheYear) || 0,
                totalSavings: Number(response.data.totalSavings) || 0
            });

        } catch (err) {
            if (requestId !== yearlyRequestId.current) return;

            console.log(err);
            setYearlyError("Unable to load the yearly report.");
            setYearlyReport({
                monthlyTransactionData: [],
                totalExpenseOftheYear: 0,
                totalIncomeOftheYear: 0,
                totalSavings: 0
            });
        } finally {
            if (requestId === yearlyRequestId.current) {
                setYearlyLoading(false);
            }
        }
    };

    // Fetch transactions for the selected date
    const getExpenses = async () => {
        try {
            setLoading(true);
            setError('');

            const token = sessionStorage.getItem("token");

            const response = await axios.post(
                GET_EXPENSES_API,
                {
                    date: selectedDate
                },
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            setTransactions({
                incomeData: response.data.incomeData || [],
                expenseData: response.data.expenseData || []
            });

            setDailyTotals({
                totalIncome: Number(response.data.totalIncome) || 0,
                totalExpense: Number(response.data.totalExpense) || 0
            });

        } catch (err) {
            console.log(err);
            setError("Unable to load transactions.");
            setDailyTotals({ totalIncome: 0, totalExpense: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Fetch whenever the selected date changes
    useEffect(() => {
        getExpenses();
    }, [selectedDate]);

    // Fetch the monthly report when the monthly tab opens or the month changes
    useEffect(() => {
        if (activeTab === 'monthly') {
            getMonthlyReport();
        }
    }, [activeTab, selectedMonth]);

    // Fetch the yearly report when the yearly tab opens or the year changes
    useEffect(() => {
        if (activeTab === 'yearly') {
            getYearlyReport();
        }
    }, [activeTab, selectedYear]);

    // Go back to the first page when the date or month changes
    useEffect(() => {
        setDailyPage(1);
    }, [selectedDate]);

    useEffect(() => {
        setMonthlyPage(1);
    }, [selectedMonth]);

    // Changing rows per page always returns to the first page
    const handleDailyPageSizeChange = (size) => {
        setDailyPageSize(size);
        setDailyPage(1);
    };

    const handleMonthlyPageSizeChange = (size) => {
        setMonthlyPageSize(size);
        setMonthlyPage(1);
    };

    // Handle date picker changes
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Navigate between dates
    const changeDate = (days) => {
        const [year, month, day] = selectedDate.split('-').map(Number);

        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + days);

        const updatedDate = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-');

        setSelectedDate(updatedDate);
    };

    // Handle month picker changes
    const handleMonthChange = (e) => {
        if (e.target.value) {
            setSelectedMonth(e.target.value);
        }
    };

    // Navigate between months
    const changeMonth = (months) => {
        const [year, month] = selectedMonth.split('-').map(Number);

        const date = new Date(year, month - 1 + months, 1);

        const updatedMonth = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0')
        ].join('-');

        setSelectedMonth(updatedMonth);
    };

    // Navigate between years
    const changeYear = (years) => {
        const updatedYear = selectedYear + years;

        if (updatedYear < 1000 || updatedYear > 9999) return;

        setSelectedYear(updatedYear);
        setYearInput(String(updatedYear));
    };

    // Typing in the year box: only accept a complete 4-digit year
    const handleYearInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);

        setYearInput(value);

        if (value.length === 4 && Number(value) >= 1000) {
            setSelectedYear(Number(value));
        }
    };

    // Leaving the box with an incomplete year puts the current year back
    const handleYearInputBlur = () => {
        setYearInput(String(selectedYear));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Open the popup with an empty form
    const handleAddClick = () => {
        setEditingTransaction(null);
        setFormData({ ...EMPTY_FORM });
        setShowForm(true);
    };

    // Open popup with existing income or expense details
    const handleEdit = (item) => {
        setEditingTransaction(item);

        setFormData({
            description: item.description,
            transactionType:
                Number(item.expenseAmount) > 0 ? 'credit' : 'debit',
            amount: Math.abs(Number(item.expenseAmount)),
            category: item.category,
            notes: item.notes || '',
            id:item.id
        });

        // Make sure a previously saved custom category is available in the dropdown
        setCategories(prev =>
            prev.includes(item.category) ? prev : [...prev, item.category]
        );

        setShowForm(true);
    };

    // Open delete confirmation popup
    const handleDelete = (item) => {
        setTransactionToDelete(item);
        setShowDeleteConfirm(true);
    };

    // Close the delete confirmation popup without deleting
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setTransactionToDelete(null);
    };

    // Delete transaction after confirmation
    const confirmDelete = async () => {
        if (!transactionToDelete) return;

        const token = sessionStorage.getItem("token");

        try {
            await axios.delete(
                `http://localhost:3000/expenseTracker/expense/deleteExpense/${transactionToDelete.id}`,
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            setShowDeleteConfirm(false);
            setTransactionToDelete(null);

            getExpenses();

        } catch (err) {
            console.log(err);
        }
    };

    // Reset and close popup
    const closeForm = () => {
        setShowForm(false);
        setEditingTransaction(null);

        setFormData({ ...EMPTY_FORM });
    };

    // Add a new income or expense
    const handleSubmit = async (e) => {
        e.preventDefault();

        const enteredAmount = Number(formData.amount);

        if (
            !formData.description.trim() ||
            !formData.amount ||
            !selectedDate
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
            alert("Amount must be greater than zero.");
            return;
        }

        const adjustedAmount =
            formData.transactionType === 'credit'
                ? enteredAmount
                : -enteredAmount;

        const payload = {
            description: formData.description.trim(),
            expenseAmount: adjustedAmount,
            category: formData.category,
            date: selectedDate,
            notes: (formData.notes || '').trim(),
            id:formData.id
        };

        try {
            setSubmitting(true);

            const token = sessionStorage.getItem("token");

            if(editingTransaction){

              await axios.post(
                EDIT_EXPENSE_API,
                payload,
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            }else{
              await axios.post(
                ADD_EXPENSE_API,
                payload,
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );
            }

            setShowForm(false);
            setEditingTransaction(null);

            setFormData({ ...EMPTY_FORM });

            await getExpenses();

        } catch (err) {
            console.log(err);
            alert(
                err.response?.data?.message ||
                "Unable to add transaction."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="home-container">

            <AppHeader
                isPremium={isPremium}
                onShowLeaderboard={showLeaderboard}
                onOpenPremium={() => setShowPremiumPopup(true)}
            />

            <main className="home-content">

                {/* View tabs (monthly and yearly are for premium users only) */}
                {isPremium && (
                    <ViewTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                )}

                {activeTab === 'daily' && (
                    <DailyView
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        onShiftDate={changeDate}
                        dailyTotals={dailyTotals}
                        transactions={transactions}
                        loading={loading}
                        error={error}
                        page={dailyPage}
                        onPageChange={setDailyPage}
                        pageSize={dailyPageSize}
                        onPageSizeChange={handleDailyPageSizeChange}
                        onAdd={handleAddClick}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}

                {activeTab === 'monthly' && (
                    <MonthlyView
                        selectedMonth={selectedMonth}
                        onMonthChange={handleMonthChange}
                        onShiftMonth={changeMonth}
                        report={monthlyReport}
                        loading={monthlyLoading}
                        error={monthlyError}
                        page={monthlyPage}
                        onPageChange={setMonthlyPage}
                        pageSize={monthlyPageSize}
                        onPageSizeChange={handleMonthlyPageSizeChange}
                    />
                )}

                {activeTab === 'yearly' && (
                    <YearlyView
                        selectedYear={selectedYear}
                        yearInput={yearInput}
                        onYearInputChange={handleYearInputChange}
                        onYearInputBlur={handleYearInputBlur}
                        onShiftYear={changeYear}
                        report={yearlyReport}
                        loading={yearlyLoading}
                        error={yearlyError}
                    />
                )}

            </main>

            {/* Add/Edit transaction popup */}
            {showForm && (
                <TransactionFormModal
                    isEditing={Boolean(editingTransaction)}
                    formData={formData}
                    categories={categories}
                    submitting={submitting}
                    suggestingCategory={suggestingCategory}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeForm}
                    onSuggestCategory={suggestCategory}
                />
            )}

            {/* Delete confirmation popup */}
            {showDeleteConfirm && (
                <DeleteConfirmModal
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
                />
            )}

            {/* Premium subscription price popup */}
            {showPremiumPopup && (
                <PremiumModal
                    onClose={() => setShowPremiumPopup(false)}
                    onConfirm={handleBecomePremiumClick}
                />
            )}

            {/* Leaderboard popup (success or failure) */}
            <LeaderboardModal
                status={leaderboardPopup}
                data={leaderboardData}
                onClose={() => setLeaderboardPopup(null)}
            />

            {/* Premium payment result popup */}
            <PaymentResultModal
                result={paymentPopup}
                onClose={() => setPaymentPopup(null)}
            />

        </div>
    );
}

export default Home;
