import Modal from './Modal';

// Add / Edit transaction popup
function TransactionFormModal({
    isEditing,
    formData,
    categories,
    submitting,
    suggestingCategory,
    onChange,
    onSubmit,
    onClose,
    onSuggestCategory
}) {
    return (
        <Modal
            title={isEditing ? "Edit transaction" : "Add a transaction"}
            onClose={onClose}
            className="transaction-form-modal"
        >

            <p className="section-description">
                {isEditing
                    ? "Update your transaction details."
                    : "Record your income or expenses."}
            </p>

            <form onSubmit={onSubmit}>

                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    placeholder="e.g. Movie tickets"
                    value={formData.description}
                    onChange={onChange}
                    required
                />

                <label>Category</label>
                <div className={`category-field${suggestingCategory ? ' loading' : ''}`}>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={onChange}
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
                        onClick={onSuggestCategory}
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
                    onChange={onChange}
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
                    onChange={onChange}
                    required
                />

                <label className="notes-label">
                    <span>
                        Notes <span className="optional-label">(optional)</span>
                    </span>
                    <span className="notes-counter">
                        {(formData.notes || '').length}/255
                    </span>
                </label>
                <textarea
                    name="notes"
                    rows={2}
                    maxLength={255}
                    placeholder="Add any extra details"
                    value={formData.notes}
                    onChange={onChange}
                />

                <button
                    type="submit"
                    className="add-button"
                    disabled={submitting}
                >
                    {submitting
                        ? "Please wait..."
                        : isEditing
                            ? "Update Transaction"
                            : "Add Transaction"}
                </button>

            </form>

        </Modal>
    );
}

export default TransactionFormModal;
