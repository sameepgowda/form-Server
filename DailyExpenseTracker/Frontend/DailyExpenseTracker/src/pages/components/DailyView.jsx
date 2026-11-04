import Pagination from './Pagination';
import PeriodNavigator from './PeriodNavigator';
import PeriodSummary from './PeriodSummary';
import TransactionList from './TransactionList';
import { DAILY_PAGE_SIZE_OPTIONS } from './constants';

function DailyView({
    selectedDate,
    onDateChange,
    onShiftDate,
    dailyTotals,
    transactions,
    loading,
    error,
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    onAdd,
    onEdit,
    onDelete
}) {
    // Income entries come first, then expenses. Each page shows only the entries
    // that fall inside it, so nothing from the previous page is repeated.
    const incomeCount = transactions.incomeData.length;
    const allDailyCount = incomeCount + transactions.expenseData.length;
    const totalPages = Math.max(1, Math.ceil(allDailyCount / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    const pagedIncome = transactions.incomeData.slice(start, end);
    const pagedExpenses = transactions.expenseData.slice(
        Math.max(0, start - incomeCount),
        Math.max(0, end - incomeCount)
    );

    return (
        <>

            <div className="transactions-toolbar">
                <div>
                    <h2>Previous Transactions</h2>
                    <p className="section-description">
                        View your income and expenses.
                    </p>
                </div>

                <button
                    className="add-button"
                    onClick={onAdd}
                >
                    + Add Expense
                </button>
            </div>

            {/* Date navigation */}
            <div className="date-filter">

                <PeriodNavigator
                    id="transaction-date"
                    label="Select date"
                    type="date"
                    value={selectedDate}
                    onChange={onDateChange}
                    onPrevious={() => onShiftDate(-1)}
                    onNext={() => onShiftDate(1)}
                    previousLabel="Previous date"
                    nextLabel="Next date"
                />

                <PeriodSummary
                    income={dailyTotals.totalIncome}
                    expense={dailyTotals.totalExpense}
                />

            </div>

            {loading ? (
                <p className="empty-message">
                    Loading transactions...
                </p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : allDailyCount === 0 ? (
                <p className="empty-message">
                    No transactions for this date.
                </p>
            ) : (
                <>
                    {pagedIncome.length > 0 && (
                        <section className="transaction-section income-section">
                            <h2>Income</h2>

                            <TransactionList
                                data={pagedIncome}
                                isCredit={true}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </section>
                    )}

                    {pagedExpenses.length > 0 && (
                        <section className="transaction-section expense-section">
                            <h2>Expenses</h2>

                            <TransactionList
                                data={pagedExpenses}
                                isCredit={false}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </section>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={allDailyCount}
                        pageSize={pageSize}
                        itemLabel="transactions"
                        onPageChange={onPageChange}
                        pageSizeOptions={DAILY_PAGE_SIZE_OPTIONS}
                        onPageSizeChange={onPageSizeChange}
                    />
                </>
            )}

        </>
    );
}

export default DailyView;
