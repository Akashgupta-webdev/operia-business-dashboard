import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";

function getVisiblePages(currentPage, pageCount) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "ellipsis-end", pageCount];
  if (currentPage >= pageCount - 2) {
    return [1, "ellipsis-start", pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", pageCount];
}

export function DashboardPagination({ page, pageCount, onPageChange }) {
  const pages = getVisiblePages(page, pageCount);

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          />
        </PaginationItem>

        {pages.map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink
                isActive={item === page}
                aria-label={`Go to page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
