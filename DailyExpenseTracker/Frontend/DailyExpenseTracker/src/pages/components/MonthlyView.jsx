
import Pagination from './Pagination';
import PeriodNavigator from './PeriodNavigator';
import PeriodSummary from './PeriodSummary';
import { MONTHLY_PAGE_SIZE_OPTIONS } from './constants';
import { formatAmount, formatReportDate } from './utils';

function MonthlyView({
    selectedMonth,
    onMonthChange,
    onShiftMonth,
    report,
    loading,
    error,
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    onDownloadMonthlyReport
}) {
    // Savings = income + expense (the monthly expense total is already negative)
    const monthlySavings = report.totalMonthlyIncome + report.totalMonthlyExpense;

    // Monthly table: one flat list of rows, paginated
    const rows = report.monthlyExpenseData;
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const pagedRows = rows.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <>
            <div className="transactions-toolbar">
                <div>
                    <h2>Monthly Report</h2>
                    <p className="section-description">
                        View your income and expenses for the month.
                    </p>
                </div>

                <button
                    type="button"
                    className="download-report-button"
                    onClick={onDownloadMonthlyReport}
                    disabled={loading || rows.length === 0}
                >
                    <span className="download-icon">↓</span>
                    Download Report
                </button>
            </div>

            {/* Month navigation */}
            <div className="date-filter">
                <PeriodNavigator
                    id="report-month"
                    label="Select month"
                    type="month"
                    value={selectedMonth}
                    onChange={onMonthChange}
                    onPrevious={() => onShiftMonth(-1)}
                    onNext={() => onShiftMonth(1)}
                    previousLabel="Previous month"
                    nextLabel="Next month"
                />

                <PeriodSummary
                    className="monthly-summary"
                    income={report.totalMonthlyIncome}
                    expense={report.totalMonthlyExpense}
                    savings={monthlySavings}
                />
            </div>

            {loading ? (
                <p className="empty-message">
                    Loading monthly report...
                </p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : rows.length === 0 ? (
                <p className="empty-message">
                    No transactions for this month.
                </p>
            ) : (
                <div className="monthly-table-card">
                    <div className="monthly-table-wrapper">
                        <table className="monthly-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th className="amount-column">Expense</th>
                                    <th className="amount-column">Income</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pagedRows.map((item) => {
                                    const amount = Number(item.expenseAmount) || 0;
                                    // Negative amount = expense, otherwise income
                                    const isExpense = amount < 0;

                                    return (
                                        <tr key={item.id}>
                                            <td className="monthly-date-cell">
                                                {formatReportDate(item.date)}
                                            </td>

                                            <td
                                                className="monthly-description-cell"
                                                title={item.description}
                                            >
                                                {item.description}
                                            </td>

                                            <td>
                                                <span className="category-chip">
                                                    {item.category}
                                                </span>
                                            </td>

                                            <td className="amount-column">
                                                {isExpense ? (
                                                    <span className="table-amount table-amount-expense">
                                                        -{formatAmount(Math.abs(amount))}
                                                    </span>
                                                ) : (
                                                    <span className="table-amount-empty">—</span>
                                                )}
                                            </td>

                                            <td className="amount-column">
                                                {!isExpense ? (
                                                    <span className="table-amount table-amount-income">
                                                        +{formatAmount(Math.abs(amount))}
                                                    </span>
                                                ) : (
                                                    <span className="table-amount-empty">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={rows.length}
                        pageSize={pageSize}
                        itemLabel="transactions"
                        onPageChange={onPageChange}
                        pageSizeOptions={MONTHLY_PAGE_SIZE_OPTIONS}
                        onPageSizeChange={onPageSizeChange}
                    />
                </div>
            )}
        </>
    );
}

export default MonthlyView;
