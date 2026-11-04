import { formatAmount } from './utils';

// One coloured summary card (income / expense / savings)
function SummaryCard({ variant, icon, label, value, negative = false }) {
    return (
        <div
            className={`summary-card summary-${variant}${negative ? ' summary-savings-negative' : ''}`}
        >
            <span className="summary-icon">{icon}</span>
            <div className="summary-text">
                <span className="summary-label">
                    {label}
                </span>
                <span className="summary-amount">
                    {value}
                </span>
            </div>
        </div>
    );
}

// Total Income / Total Expense (and optionally Savings) cards shown next to
// the date, month or year picker. Pass `savings` only when it should be shown.
function PeriodSummary({ income, expense, savings, className = '' }) {
    const hasSavings = savings !== undefined && savings !== null;

    return (
        <div className={`daily-summary${className ? ` ${className}` : ''}`}>

            <SummaryCard
                variant="income"
                icon="↑"
                label="Total Income"
                value={`+${formatAmount(Math.abs(income))}`}
            />

            <SummaryCard
                variant="expense"
                icon="↓"
                label="Total Expense"
                value={`-${formatAmount(Math.abs(expense))}`}
            />

            {hasSavings && (
                <SummaryCard
                    variant="savings"
                    negative={savings < 0}
                    icon="₹"
                    label="Savings"
                    value={`${savings < 0 ? '-' : '+'}${formatAmount(Math.abs(savings))}`}
                />
            )}

        </div>
    );
}

export default PeriodSummary;
