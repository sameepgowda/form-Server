import Modal from './Modal';
import { formatAmount } from './utils';

// Premium subscription price popup
function PremiumModal({ onClose, onConfirm }) {
    return (
        <Modal
            title="Premium Subscription"
            onClose={onClose}
            className="premium-popup-modal"
        >

            <p className="section-description">
                Unlock premium features with a one-time payment.
            </p>

            <div className="premium-price-box">
                <span className="premium-price-label">
                    Subscription amount
                </span>
                <span className="premium-price-amount">
                    {formatAmount(1)}
                </span>
            </div>

            <button
                type="button"
                className="premium-confirm-button"
                onClick={onConfirm}
            >
                Become a premium member
            </button>

        </Modal>
    );
}

export default PremiumModal;
