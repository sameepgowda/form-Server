import Modal from './Modal';
import { formatAmount } from './utils';

// Leaderboard popup. `status` is "success", "failure" or null (nothing shown).
function LeaderboardModal({ status, data, onClose }) {
    if (status === "failure") {
        return (
            <Modal
                title="Leaderboard"
                onClose={onClose}
                className="leaderboard-error-modal"
            >
                <p className="error-message">
                    Failed to load the leaderboard
                </p>
            </Modal>
        );
    }

    if (status !== "success") return null;

    return (
        <Modal
            title="Leaderboard"
            onClose={onClose}
            className="leaderboard-modal"
        >

            <p className="section-description">
                See how users rank by total expense.
            </p>

            {data.length === 0 ? (
                <p className="empty-message">
                    No users on the leaderboard yet.
                </p>
            ) : (
                <div className="leaderboard-table-wrapper">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Total Expense</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((user, index) => (
                                <tr key={user.id}>
                                    <td>
                                        <span className={`rank-badge rank-${index + 1}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="leaderboard-name">
                                        {user.username}
                                    </td>
                                    <td className="leaderboard-amount">
                                        {formatAmount(user.totalExpense)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </Modal>
    );
}

export default LeaderboardModal;
