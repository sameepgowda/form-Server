import { useState } from 'react';
import Modal from './Modal';
import { formatAmount } from './utils';

// List of income or expense rows (with View notes / Edit / Delete) for the daily view
function TransactionList({ data, isCredit, onEdit, onDelete }) {
    // Transaction whose notes are currently open in the popup (null = closed)
    const [notesItem, setNotesItem] = useState(null);

    if (data.length === 0) {
        return (
            <p className="empty-message">
                No {isCredit ? 'income' : 'expenses'} for this date.
            </p>
        );
    }

    // Empty, null or whitespace-only notes count as "no notes"
    const notesText = notesItem?.notes ? String(notesItem.notes).trim() : '';

    return (
        <>
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
                                    className="notes-button"
                                    onClick={() => setNotesItem(item)}
                                >
                                    View notes
                                </button>

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

            {/* Notes popup */}
            {notesItem && (
                <Modal
                    title="Notes"
                    onClose={() => setNotesItem(null)}
                    className="notes-modal"
                >
                    {notesText ? (
                        <p className="notes-content">{notesText}</p>
                    ) : (
                        <p className="empty-message notes-empty">
                            No notes made for this transaction.
                        </p>
                    )}
                </Modal>
            )}
        </>
    );
}

export default TransactionList;
