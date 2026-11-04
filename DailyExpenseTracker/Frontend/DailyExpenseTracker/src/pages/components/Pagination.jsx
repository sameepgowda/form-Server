function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    itemLabel,
    onPageChange,
    pageSizeOptions,
    onPageSizeChange
}) {
    const hasSizeSelector = Boolean(pageSizeOptions && onPageSizeChange);

    // With a rows-per-page dropdown, keep the bar visible whenever there is at
    // least one item, so the dropdown is always available (the page number
    // buttons only appear when there is more than one page).
    if (hasSizeSelector) {
        if (totalItems === 0) return null;
    } else if (totalPages <= 1) {
        return null;
    }

    const firstItem = (currentPage - 1) * pageSize + 1;
    const lastItem = Math.min(currentPage * pageSize, totalItems);

    // Page numbers with ellipses, e.g. 1 … 4 5 6 … 12
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            pageNumbers.push(i);
        } else if (pageNumbers[pageNumbers.length - 1] !== 'ellipsis') {
            pageNumbers.push('ellipsis');
        }
    }

    return (
        <div className="pagination">

            <div className="pagination-left">

                <span className="pagination-info">
                    Showing {firstItem}–{lastItem} of {totalItems} {itemLabel}
                </span>

                {hasSizeSelector && (
                    <label className="pagination-size">
                        <span className="pagination-size-label">Rows per page</span>
                        <select
                            className="pagination-size-select"
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                )}

            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">

                    <button
                        type="button"
                        className="pagination-button pagination-arrow"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        &#8249;
                    </button>

                    {pageNumbers.map((page, index) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                className={`pagination-button${page === currentPage ? ' active' : ''}`}
                                onClick={() => onPageChange(page)}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        type="button"
                        className="pagination-button pagination-arrow"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        &#8250;
                    </button>

                </div>
            )}

        </div>
    );
}

export default Pagination;
