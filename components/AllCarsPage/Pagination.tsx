"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const Pagination = ({
  currentPage,
  totalPages: propTotalPages,
  onPageChange,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const urlPage = parseInt(searchParams.get('page') || '1');
  
  const [page, setPage] = useState(currentPage || urlPage);
  const [totalPages, setTotalPages] = useState(propTotalPages || 1);
  const [loading, setLoading] = useState(true);

  // Fetch pagination info from API
  useEffect(() => {
    const fetchPagination = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (brand && brand !== 'ทั้งหมด') params.set('brand', brand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', '1');
        params.set('limit', '12');
        
        const url = `/api/cars?${params.toString()}`;
        const data = await apiGet<{ 
          success: boolean; 
          pagination?: PaginationInfo;
        }>(url);
        
        if (data.success && data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching pagination:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if totalPages is not provided as prop
    if (!propTotalPages) {
      fetchPagination();
    } else {
      setTotalPages(propTotalPages);
    }
  }, [searchQuery, brand, minPrice, maxPrice, propTotalPages]);

  // Sync page with URL
  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      
      // Update URL with new page
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete('page');
      } else {
        params.set('page', newPage.toString());
      }
      
      router.push(`/cars?${params.toString()}`, { scroll: false });
      onPageChange?.(newPage);
    }
  };

  // Don't render if loading and no totalPages
  if (loading && !propTotalPages && totalPages === 1) {
    return null;
  }

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

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
            {(() => {
              const pages: (number | string)[] = [];
              const maxVisible = 7; // Show max 7 page numbers
              
              if (totalPages <= maxVisible) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Show first page
                pages.push(1);
                
                if (page <= 3) {
                  // Show pages 2, 3, 4, 5
                  for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                  }
                  pages.push('...');
                } else if (page >= totalPages - 2) {
                  // Show last pages
                  pages.push('...');
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Show pages around current page
                  pages.push('...');
                  for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i);
                  }
                  pages.push('...');
                }
                
                // Show last page if not already included
                if (!pages.includes(totalPages)) {
                  pages.push(totalPages);
                }
              }
              
              return pages.map((pageNum, index) => {
                if (pageNum === '...') {
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
              });
            })()}
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

