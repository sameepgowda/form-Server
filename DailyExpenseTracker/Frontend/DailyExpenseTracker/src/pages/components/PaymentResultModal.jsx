// Premium payment result popup. `result` is "success", "failure" or null.
function PaymentResultModal({ result, onClose }) {
    if (!result) return null;

    return (
        <div
            className="payment-result-overlay"
            onClick={onClose}
        >
            <div
                className="payment-result-modal"
                role="dialog"
                aria-modal="true"
                aria-live="polite"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`payment-result-icon ${result}`}>
                    {result === "success" ? "✓" : "×"}
                </div>

                <h2>
                    {result === "success"
                        ? "Congrats, you're a premium member now!"
                        : "Sorry. Your payment didn't go through."}
                </h2>

                <button
                    type="button"
                    className="payment-result-close-button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default PaymentResultModal;
