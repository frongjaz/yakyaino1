"use client";
import { useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      router.push(`/cars?${params.toString()}`, { scroll: false });
    }
  };

  if (totalPages <= 1) return null;

  const buildPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page <= 3) {
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push("...");
      } else if (page >= totalPages - 2) {
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push("...");
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="bg-[#2C2C2C] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="mr-2 text-white">หน้า</span>
            {buildPages().map((pageNum, index) => {
              if (pageNum === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              const pageNumber = pageNum as number;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    page === pageNumber
                      ? "bg-[#EF4444] text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  aria-label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pagination;
