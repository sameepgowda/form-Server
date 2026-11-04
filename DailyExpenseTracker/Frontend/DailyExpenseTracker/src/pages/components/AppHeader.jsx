function AppHeader({ isPremium, onShowLeaderboard, onOpenPremium }) {
    return (
        <header className="home-header">
            <div>
                <h1>Expense Tracker</h1>
                {/* Cashfree renders its checkout popup into this container */}
                <div id="cf_checkout"></div>
                <p>Keep track of your income and expenses.</p>
            </div>

            <div className="header-actions">
                {isPremium ? (
                    <>
                        <span className="premium-user-text">Premium User</span>

                        <button
                            className="leaderboard-button"
                            onClick={onShowLeaderboard}
                        >
                            Show Leaderboard
                        </button>
                    </>
                ) : (
                    <button
                        className="premium-button"
                        onClick={onOpenPremium}
                    >
                        Premium Subscription
                    </button>
                )}

                <button
                    className="logout-button"
                    onClick={() => {
                        sessionStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default AppHeader;
