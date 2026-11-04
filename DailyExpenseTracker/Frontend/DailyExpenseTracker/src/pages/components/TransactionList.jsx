import { formatAmount } from './utils';

// List of income or expense rows (with Edit / Delete) for the daily view
function TransactionList({ data, isCredit, onEdit, onDelete }) {
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
                                onClick={() => onEdit(item)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => onDelete(item)}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            ))}
        </div>
    );
}

export default TransactionList;
