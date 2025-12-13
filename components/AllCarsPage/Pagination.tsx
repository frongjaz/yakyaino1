"use client";
import { useState } from "react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
}: PaginationProps) => {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  return (
    <section className="bg-[#2C2C2C] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`rounded-full p-2 transition ${
              page === 1
                ? "cursor-not-allowed opacity-50 text-gray-500"
                : "text-white hover:bg-gray-700"
            }`}
            aria-label="Previous page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            <span className="mr-2 text-white">หน้า</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    page === pageNum
                      ? "bg-[#EF4444] text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`rounded-full p-2 transition ${
              page === totalPages
                ? "cursor-not-allowed opacity-50 text-gray-500"
                : "text-white hover:bg-gray-700"
            }`}
            aria-label="Next page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pagination;

