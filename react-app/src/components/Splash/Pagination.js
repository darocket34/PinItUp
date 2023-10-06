function Pagination({ currentPage, totalPages, onPageChange, onReturnToTop }) {
    const pageNumbers = Array.from({ length: totalPages }, (x, index) => index + 1);

    return (
        <div className="pagination">
            {pageNumbers.map((pageNumber) => (
            <button
                key={pageNumber}
                className={`page-button ${pageNumber === currentPage ? "active" : ""}`}
                onClick={() => {
                    onPageChange(pageNumber);
                    onReturnToTop();
                }}
            >
                {pageNumber}
            </button>
            ))}
        </div>
    );
  }

  export default Pagination;
