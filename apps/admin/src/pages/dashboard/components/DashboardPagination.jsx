import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardPagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;
  const start = Math.min(Math.max(1, page - 2), Math.max(1, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => start + index);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2">
      <Button type="button" variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft aria-hidden="true" className="size-3.5" /></Button>
      {pages.map((pageNumber) => <Button key={pageNumber} type="button" variant={pageNumber === page ? "default" : "outline"} size="icon-sm" onClick={() => onPageChange(pageNumber)} aria-current={pageNumber === page ? "page" : undefined}>{pageNumber}</Button>)}
      <Button type="button" variant="outline" size="icon-sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight aria-hidden="true" className="size-3.5" /></Button>
    </nav>
  );
}
