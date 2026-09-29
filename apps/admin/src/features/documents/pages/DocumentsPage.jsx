import { useState } from 'react';
import { FileText, Clock, CircleAlert, CircleCheck, Search } from 'lucide-react';
import { Card } from '@operio/ui/components/card';
import { Button } from '@operio/ui/components/button';
import { Input } from '@operio/ui/components/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@operio/ui/components/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@operio/ui/components/pagination';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@operio/ui/components/select';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import useDocuments from '../hooks/useDocuments';
import { documentExpiry, documentLink, parseDocumentDate } from '../utils/documentDisplay';

const metrics = [
  { key: 'totalDocuments', title: 'Total documents', description: 'All client documents', icon: FileText },
  { key: 'expiringIn30Days', title: 'Expiring in 30 days', description: 'Require attention', icon: Clock },
  { key: 'expired', title: 'Expired', description: 'Action required', icon: CircleAlert },
  { key: 'validDocuments', title: 'Valid documents', description: 'No action needed', icon: CircleCheck },

];
const pageSizes = [10, 25, 50, 100];

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const [pagination, setPagination] = useState({ search: '', page: 1, limit: 50 });
  if (pagination.search !== debouncedSearch) {
    setPagination({ ...pagination, search: debouncedSearch, page: 1 });
  }
  const filters = { search: debouncedSearch, limit: pagination.limit, page: pagination.search === debouncedSearch ? pagination.page : 1 };
  const { data, isPending, isError, error, refetch, isFetching } = useDocuments(filters);
  const documents = data?.data ?? [];
  const total = data?.page?.total ?? 0;
  const totalPages = Math.max(1, data?.page?.totalPages ?? 1);
  const currentLimit = data?.page?.limit ?? filters.limit;
  const currentPage = data?.page?.page ?? filters.page;
  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  function pageProps(page, disabled = false) {
    return {
      href: '#', 'aria-disabled': disabled, tabIndex: disabled ? -1 : 0,
      className: `rounded-full ${disabled ? 'pointer-events-none opacity-50' : ''}`,
      onClick: (event) => { event.preventDefault(); if (!disabled) setPagination({ search: debouncedSearch, limit: filters.limit, page }); },
    };
  }
  return <div className="min-h-[calc(100svh-var(--header-height))] space-y-4 bg-app-background px-4 py-5 sm:px-6 lg:px-8">
    <header><div className="flex items-center gap-3"><FileText aria-hidden="true" className="size-5 shrink-0 text-primary-600" /><h1 className="text-lg font-bold text-text-primary">Documents / Renewals</h1></div><p className="mt-1 text-xs text-text-secondary">Track and manage client documents and expiry dates in one place.</p></header>
    <section aria-label="Document overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ key, title, description, icon: Icon }) => <Card key={title} size="sm" className="gap-0 border border-border-default bg-surface-primary p-3 shadow-none ring-0">
        <div className="flex items-center gap-3"><span className="rounded-md bg-accent p-1.5 text-primary"><Icon className="size-4" aria-hidden="true" /></span><h2 className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">{title}</h2></div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-primary">{data?.kpi?.[key] ?? (isPending ? '...' : '-')}</p>
        <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
      </Card>)}
    </section>
    <section aria-label="Document list" className="overflow-hidden rounded-xl border border-border-default bg-surface-primary">
      <div className="flex flex-wrap items-center gap-3 border-b border-border-default p-3 sm:p-4">
        <h2 className="mr-auto text-sm font-semibold">All documents</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 size-4 text-text-muted" aria-hidden="true" />
          <Input aria-label="Search documents or clients" placeholder="Search documents or clients" maxLength={100} value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 pl-9 text-xs md:text-xs" />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="document-page-size" className="text-xs text-text-secondary">Per page</label>
          <Select value={String(filters.limit)} onValueChange={(value) => {
            const limit = Number(value);
            if (pageSizes.includes(limit)) setPagination({ search: debouncedSearch, limit, page: 1 });
          }}>
            <SelectTrigger id="document-page-size" className="min-h-11 w-20 rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{pageSizes.map((limit) => <SelectItem key={limit} value={String(limit)}>{limit}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      {isError ? <div role="alert" className="space-y-3 p-8 text-center"><p className="font-semibold">Unable to load documents</p><p className="text-sm text-text-secondary">{error?.response?.status === 403 ? 'Your account does not have permission to view this document list.' : 'Please try again.'}</p><Button variant="outline" className="rounded-full" onClick={() => refetch()} disabled={isFetching}>Try again</Button></div> : <>
        <div className="overflow-x-auto" aria-busy={isFetching}>
          <Table className="text-xs [&_td]:px-3 [&_td]:py-3 [&_th]:px-3"><TableHeader><TableRow className="bg-muted/40">{['Document', 'Client', 'Type', 'Issue date', 'Expiry date', 'Days remaining', 'Status'].map((heading) => <TableHead key={heading} className="text-[11px] uppercase tracking-wide text-text-secondary">{heading}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {isPending ? <TableRow><TableCell colSpan={7} className="h-40 text-center text-text-secondary"><span role="status">Loading documents…</span></TableCell></TableRow> : documents.length === 0 ? <TableRow><TableCell colSpan={7} className="h-40 text-center"><FileText className="mx-auto mb-3 size-7 text-text-muted" /><p className="font-medium">No documents found</p><p className="mt-1 text-sm text-text-secondary">Try a different search or clear the search field.</p>{filters.page > 1 && <Button variant="ghost" className="mt-3 rounded-full" onClick={() => setPagination({ search: debouncedSearch, limit: filters.limit, page: 1 })}>Back to first page</Button>}</TableCell></TableRow> : documents.map((document) => {
                const expiry = documentExpiry(document.expiryDate);
                const url = documentLink(document.documentURL);
                return <TableRow key={document.id}>
                  <TableCell><div className="flex items-center gap-3"><FileText aria-hidden="true" className="size-4 shrink-0 text-primary" />{url ? <a href={url} target="_blank" rel="noopener noreferrer" className="max-w-64 whitespace-normal break-words font-medium text-[#1264a3] hover:underline" aria-label={`${document.documentTitle || 'Untitled document'} (opens in new tab)`}>{document.documentTitle || 'Untitled document'}</a> : <span className="max-w-64 whitespace-normal break-words font-medium">{document.documentTitle || 'Untitled document'}</span>}</div></TableCell>
                  <TableCell className="max-w-64 whitespace-normal">{document.clientName || document.client?.name || '—'}</TableCell>
                  <TableCell>{document.documentType || '—'}</TableCell>
                  <TableCell>{parseDocumentDate(document.issueDate) ? document.issueDate : '—'}</TableCell>
                  <TableCell>{parseDocumentDate(document.expiryDate) ? document.expiryDate : '—'}</TableCell>
                  <TableCell>{expiry.days}</TableCell><TableCell><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${expiry.className}`}>{expiry.label}</span></TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </div>
        {!isPending && <footer className="flex flex-col items-center justify-between gap-4 border-t border-border-default p-4 sm:flex-row">
          <p className="shrink-0 text-xs text-text-secondary" role="status">{documents.length ? `${(currentPage - 1) * currentLimit + 1}–${(currentPage - 1) * currentLimit + documents.length}` : '0'} of {total} documents · {currentLimit} per page</p>
          <Pagination className="mx-0 w-auto" aria-label="Document pages"><PaginationContent>
            <PaginationItem><PaginationPrevious {...pageProps(currentPage - 1, currentPage <= 1 || isFetching)} /></PaginationItem>
            {pages.map((page, index) => <PaginationItem key={page} className="flex items-center">{index > 0 && page - pages[index - 1] > 1 && <PaginationEllipsis />}<PaginationLink {...pageProps(page, isFetching)} isActive={page === currentPage} aria-label={`Page ${page}`}>{page}</PaginationLink></PaginationItem>)}
            <PaginationItem><PaginationNext {...pageProps(currentPage + 1, currentPage >= totalPages || isFetching)} /></PaginationItem>
          </PaginationContent></Pagination>
        </footer>}
      </>}
    </section>
  </div>;
}
