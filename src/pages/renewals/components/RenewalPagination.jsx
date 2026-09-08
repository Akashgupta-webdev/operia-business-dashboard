import { Fragment } from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getRenewalPageNumbers } from "@/lib/renewals";

export default function RenewalPagination({ page, totalPages, disabled, onPageChange }) {
  const pages = getRenewalPageNumbers(page, totalPages);
  const propsFor = (nextPage, unavailable = false) => ({
    href: "#renewals-list",
    "aria-disabled": disabled || unavailable,
    tabIndex: disabled || unavailable ? -1 : 0,
    className: disabled || unavailable ? "pointer-events-none opacity-50" : "text-caption",
    onClick: (event) => {
      event.preventDefault();
      if (!disabled && !unavailable) onPageChange(nextPage);
    },
  });
  if (totalPages <= 1 && page <= 1) return null;
  return (
    <Pagination aria-label="Renewals pagination" className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem><PaginationPrevious {...propsFor(Math.min(page - 1, Math.max(1, totalPages)), page <= 1)} /></PaginationItem>
        {pages.map((number, index) => <Fragment key={number}>
          {index > 0 && number - pages[index - 1] > 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
          <PaginationItem><PaginationLink {...propsFor(number)} isActive={number === page} aria-label={"Go to page " + number}>{number}</PaginationLink></PaginationItem>
        </Fragment>)}
        <PaginationItem><PaginationNext {...propsFor(page + 1, page >= totalPages)} /></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
