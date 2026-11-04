// Shared popup shell: dark overlay, white card, title and close (×) button.
// Clicking the overlay closes it; clicking inside the card does not.
function Modal({ title, onClose, className = '', children }) {
    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className={`expense-form-card modal-content${className ? ` ${className}` : ''}`}
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-heading">
                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="close-modal-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {children}

            </div>
        </div>
    );
}

export default Modal;
