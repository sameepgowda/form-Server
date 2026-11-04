// Label + "‹ [input] ›" navigation used by the date, month and year filters.
// Any extra props (type, value, onChange, onBlur, maxLength, ...) go straight
// to the <input>. Render it inside a <div className="date-filter">.
function PeriodNavigator({
    id,
    label,
    onPrevious,
    onNext,
    previousLabel,
    nextLabel,
    className = '',
    ...inputProps
}) {
    return (
        <>
            <label htmlFor={id}>
                {label}
            </label>

            <div className={`date-navigation${className ? ` ${className}` : ''}`}>

                <button
                    type="button"
                    className="date-nav-button"
                    onClick={onPrevious}
                    aria-label={previousLabel}
                >
                    &#8249;
                </button>

                <input id={id} {...inputProps} />

                <button
                    type="button"
                    className="date-nav-button"
                    onClick={onNext}
                    aria-label={nextLabel}
                >
                    &#8250;
                </button>

            </div>
        </>
    );
}

export default PeriodNavigator;
