import React from "react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  loading = false,
  maxVisible = 5,
  showInfo = true
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    let start, end;

    if (totalPages <= maxVisible) {
      start = 1;
      end = totalPages;
    } else {
      const half = Math.floor(maxVisible / 2);
      start = Math.max(1, currentPage - half);
      end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {showInfo && (
        <div className="text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === 1 || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          Trước
        </button>

        {visiblePages.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            disabled={loading}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentPage === pageNumber
                ? 'bg-green-700 text-white'
                : loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === totalPages || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination;