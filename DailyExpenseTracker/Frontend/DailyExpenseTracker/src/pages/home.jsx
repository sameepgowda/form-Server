import { useEffect, useState } from 'react';
import axios from 'axios';
import { load } from "@cashfreepayments/cashfree-js";

function getTodayDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset();

    return new Date(today.getTime() - offset * 60000)
        .toISOString()
        .split('T')[0];
}

function Home() {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());

    const [formData, setFormData] = useState({
        description: '',
        transactionType: 'debit',
        amount: '',
        category: 'Food',
        id:null
    });

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

    // Read premium status from sessionStorage before the page renders
    const isPremium = sessionStorage.getItem("isPremium") === "true";

    const ADD_EXPENSE_API =
        "http://localhost:3000/expenseTracker/expense/addExpense";
    
    const EDIT_EXPENSE_API = "http://localhost:3000/expenseTracker/expense/editExpense";

    const GET_EXPENSES_API =
        "http://localhost:3000/expenseTracker/expense/getDailyBalance";

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

        } catch (err) {
            console.log(err);
            setError("Unable to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch whenever the selected date changes
    useEffect(() => {
        getExpenses();
    }, [selectedDate]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

        setFormData({
            description: '',
            transactionType: 'debit',
            amount: '',
            category: 'Food'
        });
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

            setFormData({
                description: '',
                transactionType: 'debit',
                amount: '',
                category: 'Food'
            });

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

    const formatAmount = (amount) => {
        return Number(amount).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
    };

    // Render income and expense transactions
    const renderTransactions = (data, isCredit) => {
        if (data.length === 0) {
            return (
                <p className="empty-message">
                    No {isCredit ? 'income' : 'expenses'} for this date.
                </p>
            );
        }

        return (
            <div className="expense-list">
                {data.map((item) => (
                    <div className="expense-item" key={item.id}>

                        <div className="expense-info">
                            <h3>{item.category}</h3>
                            <p>{item.description}</p>
                        </div>

                        <div className="expense-actions">

                            <span className={
                                isCredit ? "credit-amount" : "debit-amount"
                            }>
                                {isCredit ? "+" : "-"}
                                {formatAmount(
                                    Math.abs(Number(item.expenseAmount))
                                )}
                            </span>

                            <div className="transaction-buttons">

                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() => handleDelete(item)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="home-container">

            <header className="home-header">
                <div>
                    <h1>Expense Tracker</h1>
                    <div id="cf_checkout"></div>
                    <p>Keep track of your income and expenses.</p>
                </div>

                

                <div className="header-actions">
    {isPremium ? (
        <>
            <span className="premium-user-text">Premium User</span>

            <button
                className="leaderboard-button"
                onClick={showLeaderboard}
            >
                Show Leaderboard
            </button>
        </>
    ) : (
        <button
            className="premium-button"
            onClick={() => setShowPremiumPopup(true)}
        >
            Premium Subscription
        </button>
    )}

    <button
        className="logout-button"
        onClick={() => {
            sessionStorage.removeItem("token");
            window.location.href = "/login";
        }}
    >
        Logout
    </button>
</div>
            </header>

            <main className="home-content">

                <div className="transactions-toolbar">
                    <div>
                        <h2>Previous Transactions</h2>
                        <p className="section-description">
                            View your income and expenses.
                        </p>
                    </div>

                    <button
                        className="add-button"
                        onClick={() => {
                            setEditingTransaction(null);

                            setFormData({
                                description: '',
                                transactionType: 'debit',
                                amount: '',
                                category: 'Food'
                            });

                            setShowForm(true);
                        }}
                    >
                        + Add Expense
                    </button>
                </div>

                {/* Date navigation */}
                <div className="date-filter">

                    <label htmlFor="transaction-date">
                        Select date
                    </label>

                    <div className="date-navigation">

                        <button
                            type="button"
                            className="date-nav-button"
                            onClick={() => changeDate(-1)}
                            aria-label="Previous date"
                        >
                            &#8249;
                        </button>

                        <input
                            id="transaction-date"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />

                        <button
                            type="button"
                            className="date-nav-button"
                            onClick={() => changeDate(1)}
                            aria-label="Next date"
                        >
                            &#8250;
                        </button>

                    </div>

                </div>

                {loading ? (
                    <p className="empty-message">
                        Loading transactions...
                    </p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        <section className="transaction-section">
                            <h2>Income</h2>

                            {renderTransactions(
                                transactions.incomeData,
                                true
                            )}
                        </section>

                        <section className="transaction-section">
                            <h2>Expenses</h2>

                            {renderTransactions(
                                transactions.expenseData,
                                false
                            )}
                        </section>
                    </>
                )}

            </main>

            {/* Add/Edit transaction popup */}
            {showForm && (
                <div
                    className="modal-overlay"
                    onClick={closeForm}
                >
                    <div
                        className="expense-form-card modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-heading">
                            <h2>
                                {editingTransaction
                                    ? "Edit transaction"
                                    : "Add a transaction"}
                            </h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={closeForm}
                            >
                                ×
                            </button>
                        </div>

                        <p className="section-description">
                            {editingTransaction
                                ? "Update your transaction details."
                                : "Record your income or expenses."}
                        </p>

                        <form onSubmit={handleSubmit}>

                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="e.g. Movie tickets"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                            <label>Category</label>
                            <div className={`category-field${suggestingCategory ? ' loading' : ''}`}>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={suggestingCategory}
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="suggest-category-button"
                                    onClick={suggestCategory}
                                    disabled={suggestingCategory}
                                >
                                    {suggestingCategory ? (
                                        <>
                                            <span className="suggest-spinner"></span>
                                            Suggesting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="suggest-icon">✦</span>
                                            Suggest category
                                        </>
                                    )}
                                </button>
                            </div>

                            <label>Transaction type</label>
                            <select
                                name="transactionType"
                                value={formData.transactionType}
                                onChange={handleChange}
                            >
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </select>

                            <label>Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                min="0.01"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="submit"
                                className="add-button"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Please wait..."
                                    : editingTransaction
                                        ? "Update Transaction"
                                        : "Add Transaction"}
                            </button>

                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation popup */}
            {showDeleteConfirm && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        setShowDeleteConfirm(false);
                        setTransactionToDelete(null);
                    }}
                >
                    <div
                        className="expense-form-card modal-content delete-confirm-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-heading">
                            <h2>Confirm deletion</h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setTransactionToDelete(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <p>
                            Are you sure you want to delete this transaction?
                        </p>

                        <div className="confirmation-buttons">

                            <button
                                type="button"
                                className="cancel-delete-button"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setTransactionToDelete(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-delete-button"
                                onClick={confirmDelete}
                            >
                                Confirm
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* Premium subscription price popup */}
            {showPremiumPopup && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowPremiumPopup(false)}
                >
                    <div
                        className="expense-form-card modal-content premium-popup-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-heading">
                            <h2>Premium Subscription</h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={() => setShowPremiumPopup(false)}
                            >
                                ×
                            </button>
                        </div>

                        <p className="section-description">
                            Unlock premium features with a one-time payment.
                        </p>

                        <div className="premium-price-box">
                            <span className="premium-price-label">
                                Subscription amount
                            </span>
                            <span className="premium-price-amount">
                                {formatAmount(1)}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="premium-confirm-button"
                            onClick={handleBecomePremiumClick}
                        >
                            Become a premium member
                        </button>

                    </div>
                </div>
            )}

            {/* Leaderboard popup */}
            {leaderboardPopup === "success" && (
                <div
                    className="modal-overlay"
                    onClick={() => setLeaderboardPopup(null)}
                >
                    <div
                        className="expense-form-card modal-content leaderboard-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-heading">
                            <h2>Leaderboard</h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={() => setLeaderboardPopup(null)}
                            >
                                ×
                            </button>
                        </div>

                        <p className="section-description">
                            See how users rank by total expense.
                        </p>

                        {leaderboardData.length === 0 ? (
                            <p className="empty-message">
                                No users on the leaderboard yet.
                            </p>
                        ) : (
                            <div className="leaderboard-table-wrapper">
                                <table className="leaderboard-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Name</th>
                                            <th>Total Expense</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {leaderboardData.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <span className={`rank-badge rank-${index + 1}`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="leaderboard-name">
                                                    {user.username}
                                                </td>
                                                <td className="leaderboard-amount">
                                                    {formatAmount(user.totalExpense)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Leaderboard failure popup */}
            {leaderboardPopup === "failure" && (
                <div
                    className="modal-overlay"
                    onClick={() => setLeaderboardPopup(null)}
                >
                    <div
                        className="expense-form-card modal-content leaderboard-error-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-heading">
                            <h2>Leaderboard</h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={() => setLeaderboardPopup(null)}
                            >
                                ×
                            </button>
                        </div>

                        <p className="error-message">
                            Failed to load the leaderboard
                        </p>

                    </div>
                </div>
            )}

            {/* Premium payment result popup */}
            {paymentPopup && (
                <div
                    className="payment-result-overlay"
                    onClick={() => setPaymentPopup(null)}
                >
                    <div
                        className="payment-result-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-live="polite"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`payment-result-icon ${paymentPopup}`}>
                            {paymentPopup === "success" ? "✓" : "×"}
                        </div>

                        <h2>
                            {paymentPopup === "success"
                                ? "Congrats, you're a premium member now!"
                                : "Sorry. Your payment didn't go through."}
                        </h2>

                        <button
                            type="button"
                            className="payment-result-close-button"
                            onClick={() => setPaymentPopup(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;
