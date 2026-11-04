export const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MONTH_FULL_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Today's date as "YYYY-MM-DD" in the user's local time zone
export function getTodayDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset();

    return new Date(today.getTime() - offset * 60000)
        .toISOString()
        .split('T')[0];
}

// Convert "2026-11-01" into "1-Nov-2026"
export function formatReportDate(dateString) {
    const [year, month, day] = String(dateString).slice(0, 10).split('-').map(Number);

    if (!year || !month || !day) return String(dateString);

    return `${day}-${MONTH_NAMES[month - 1]}-${year}`;
}

// Format a number as Indian rupees, e.g. 5000 -> "₹5,000.00"
export function formatAmount(amount) {
    return Number(amount).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
    });
}
