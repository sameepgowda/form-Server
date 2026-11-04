import Modal from './Modal';

function DeleteConfirmModal({ onCancel, onConfirm }) {
    return (
        <Modal
            title="Confirm deletion"
            onClose={onCancel}
            className="delete-confirm-modal"
        >

            <p>
                Are you sure you want to delete this transaction?
            </p>

            <div className="confirmation-buttons">

                <button
                    type="button"
                    className="cancel-delete-button"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="confirm-delete-button"
                    onClick={onConfirm}
                >
                    Confirm
                </button>

            </div>

        </Modal>
    );
}

export default DeleteConfirmModal;
