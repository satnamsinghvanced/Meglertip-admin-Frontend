/* eslint-disable react/prop-types */

import React from "react";

const Pagination = ({ totalPages, page, setPage }) => {
  if (totalPages <= 1) return null; 

  const handlePageChange = (num) => {
    if (num >= 1 && num <= totalPages) setPage(num);
  };

  const getVisiblePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center gap-2 mt-6 mb-3 ">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 rounded-md transition ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#161925] text-white hover:bg-[#161925]/85"
        }`}
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((num, idx) => {
          const prev = visiblePages[idx - 1];
          const showDots = prev && num - prev > 1;
          return (
            <React.Fragment key={num}>
              {showDots && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  num === page
                    ? "bg-[#161925] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {num}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-md transition ${
          page === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#161925] text-white hover:bg-[#161925]/85"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
