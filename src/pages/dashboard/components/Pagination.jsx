import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }) {
  return <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

export function PaginationItem(props) {
  return <li {...props} />;
}

export function PaginationLink({ className, isActive, size = "icon-sm", ...props }) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        isActive && "border-primary bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="sm"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft data-icon="inline-start" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="sm"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRight data-icon="inline-end" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex size-7 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
