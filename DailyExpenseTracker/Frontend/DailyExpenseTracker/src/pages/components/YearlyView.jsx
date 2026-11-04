import PeriodNavigator from './PeriodNavigator';
import PeriodSummary from './PeriodSummary';
import { MONTH_FULL_NAMES, formatAmount } from './utils';

function YearlyView({
    selectedYear,
    yearInput,
    onYearInputChange,
    onYearInputBlur,
    onShiftYear,
    report,
    loading,
    error
}) {
    // Yearly table: newest month first (same order as the monthly table)
    const rows = [...report.monthlyTransactionData].sort(
        (a, b) => Number(b.month) - Number(a.month)
    );

    return (
        <>

            <div className="transactions-toolbar">
                <div>
                    <h2>
                        Yearly Report
                        <span className="year-badge">{selectedYear}</span>
                    </h2>
                    <p className="section-description">
                        View your income, expenses and savings for the year.
                    </p>
                </div>
            </div>

            {/* Year navigation */}
            <div className="date-filter">

                <PeriodNavigator
                    id="report-year"
                    label="Select year"
                    className="year-navigation"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={yearInput}
                    onChange={onYearInputChange}
                    onBlur={onYearInputBlur}
                    onPrevious={() => onShiftYear(-1)}
                    onNext={() => onShiftYear(1)}
                    previousLabel="Previous year"
                    nextLabel="Next year"
                />

                <PeriodSummary
                    className="monthly-summary"
                    income={report.totalIncomeOftheYear}
                    expense={report.totalExpenseOftheYear}
                    savings={report.totalSavings}
                />

            </div>

            {loading ? (
                <p className="empty-message">
                    Loading yearly report...
                </p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : rows.length === 0 ? (
                <p className="empty-message">
                    No transactions for {selectedYear}.
                </p>
            ) : (
                <div className="monthly-table-card">

                    <div className="monthly-table-wrapper">
                        <table className="monthly-table yearly-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th className="amount-column">Total Income</th>
                                    <th className="amount-column">Total Expense</th>
                                    <th className="amount-column">Total Savings</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((item) => {
                                    const income = Number(item.totalMonthlyCredit) || 0;
                                    const expense = Number(item.totalMonthlyExpense) || 0;
                                    const savings = Number(item.totalMonthlySavings) || 0;

                                    return (
                                        <tr key={item.month}>
                                            <td className="yearly-month-cell">
                                                {MONTH_FULL_NAMES[Number(item.month) - 1] || item.month}
                                            </td>

                                            <td className="amount-column">
                                                {income !== 0 ? (
                                                    <span className="table-amount table-amount-income">
                                                        +{formatAmount(Math.abs(income))}
                                                    </span>
                                                ) : (
                                                    <span className="table-amount-empty">—</span>
                                                )}
                                            </td>

                                            <td className="amount-column">
                                                {expense !== 0 ? (
                                                    <span className="table-amount table-amount-expense">
                                                        -{formatAmount(Math.abs(expense))}
                                                    </span>
                                                ) : (
                                                    <span className="table-amount-empty">—</span>
                                                )}
                                            </td>

                                            <td className="amount-column">
                                                <span className={`table-amount ${savings < 0 ? 'table-amount-savings-negative' : 'table-amount-savings'}`}>
                                                    {savings < 0 ? "-" : "+"}
                                                    {formatAmount(Math.abs(savings))}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

        </>
    );
}

export default YearlyView;
