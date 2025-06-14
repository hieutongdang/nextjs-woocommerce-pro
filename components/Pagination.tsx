'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage?: number;
  hasNextPage: boolean;
  baseUrl: string;
  nextCursor?: string | null;
  prevCursor?: string | null;
}

export default function Pagination({
  currentPage = 1,
  hasNextPage,
  baseUrl,
}: PaginationProps) {
  // Show up to 5 page numbers: [current-2, current-1, current, current+1, current+2]
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= currentPage + 2; i++) {
    if (i === currentPage || i === 1 || (hasNextPage && i <= currentPage + 2)) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      {/* Previous Button */}
      <a
        href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : undefined}
        className={`px-3 py-2 rounded-md font-medium border transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-primary border-primary hover:bg-primary/10'}`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </a>
      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <a
          key={page}
          href={`${baseUrl}?page=${page}`}
          className={`px-3 py-2 rounded-md font-medium border transition-colors ${page === currentPage ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary hover:bg-primary/10'}`}
        >
          {page}
        </a>
      ))}
      {/* Next Button */}
      <a
        href={hasNextPage ? `${baseUrl}?page=${currentPage + 1}` : undefined}
        className={`px-3 py-2 rounded-md font-medium border transition-colors ${!hasNextPage ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-primary border-primary hover:bg-primary/10'}`}
        aria-disabled={!hasNextPage}
      >
        Next
      </a>
    </div>
  );
} 