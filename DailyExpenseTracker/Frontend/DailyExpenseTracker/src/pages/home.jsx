
import { useEffect, useState } from 'react';
import axios from 'axios';

function getTodayDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset();

    return new Date(today.getTime() - offset * 60000)
        .toISOString()
        .split('T')[0];
}

function Home() {
    const userId = sessionStorage.getItem("UserId");

    const [formData, setFormData] = useState({
        description: '',
        transactionType: 'debit',
        amount: '',
        category: 'Food',
        date: getTodayDate()
    });

    const [transactions, setTransactions] = useState({
        incomeData: [],
        expenseData: []
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const ADD_EXPENSE_API =
        "http://localhost:3000/expenseTracker/expense/addExpense";

    const GET_EXPENSES_API =
        "http://localhost:3000/expenseTracker/expense/getDailyBalance";

    // Fetch income and expense data for the selected date
    const getExpenses = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(GET_EXPENSES_API, {
                UserId: userId,
                date: formData.date
            });

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

    useEffect(() => {
        getExpenses();
    }, [userId, formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add a new income or expense
    const handleSubmit = async (e) => {
        e.preventDefault();

        const enteredAmount = Number(formData.amount);

        if (
            !formData.description.trim() ||
            !formData.amount ||
            !formData.date
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
            alert("Amount must be greater than zero.");
            return;
        }

        // Credit is positive; debit is negative
        const adjustedAmount =
            formData.transactionType === 'credit'
                ? enteredAmount
                : -enteredAmount;

        const payload = {
            UserId: userId,
            description: formData.description.trim(),
            expenseAmount: adjustedAmount,
            category: formData.category,
            date: formData.date
        };

        try {
            setSubmitting(true);

            await axios.post(ADD_EXPENSE_API, payload);

            setFormData(prev => ({
                ...prev,
                description: '',
                transactionType: 'debit',
                amount: '',
                category: 'Food'
            }));

            setShowForm(false);

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

                        <span className={
                            isCredit ? "credit-amount" : "debit-amount"
                        }>
                            {isCredit ? "+" : "-"}
                            {formatAmount(
                                Math.abs(Number(item.expenseAmount))
                            )}
                        </span>
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
                    <p>Keep track of your income and expenses.</p>
                </div>

                <button
                    className="logout-button"
                    onClick={() => {
                        sessionStorage.removeItem("UserId");
                        window.location.href = "/login";
                    }}
                >
                    Logout
                </button>
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
                        onClick={() => setShowForm(true)}
                    >
                        + Add Expense
                    </button>
                </div>

                <div className="date-filter">
                    <label htmlFor="transaction-date">
                        Select date
                    </label>

                    <input
                        id="transaction-date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <button
                        className="refresh-button"
                        onClick={getExpenses}
                        disabled={loading}
                    >
                        Refresh
                    </button>
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

            {/* Add transaction popup */}
            {showForm && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="expense-form-card modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-heading">
                            <h2>Add a transaction</h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <p className="section-description">
                            Record your income or expenses.
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

                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Food">Food</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Travel">Travel</option>
                                <option value="Salary">Salary</option>
                                <option value="Bills">Bills</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                            </select>

                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="submit"
                                className="add-button"
                                disabled={submitting}
                            >
                                {submitting ? "Adding..." : "Add Transaction"}
                            </button>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;
