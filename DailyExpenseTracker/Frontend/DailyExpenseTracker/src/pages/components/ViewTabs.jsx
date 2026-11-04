const TABS = [
    { key: 'daily', label: 'Daily' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' }
];

// Daily / Monthly / Yearly switcher (shown to premium users only)
function ViewTabs({ activeTab, onChange }) {
    return (
        <div className="view-tabs" role="tablist">
            {TABS.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    className={`view-tab${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => onChange(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default ViewTabs;
