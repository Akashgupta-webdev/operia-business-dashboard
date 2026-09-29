import { useState } from 'react';
import { FileText, Clock, CircleAlert, CircleCheck, Activity, Search, SlidersHorizontal } from 'lucide-react';
import { Card } from '@operio/ui/components/card';
import { Button } from '@operio/ui/components/button';
import { Input } from '@operio/ui/components/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@operio/ui/components/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@operio/ui/components/pagination';
import PageHeader from '@/components/page-header';
import useDocuments from '../hooks/useDocuments';
import { documentExpiry, documentLink, parseDocumentDate } from '../utils/documentDisplay';

const metrics = [
  { title: 'Total documents', description: 'All client documents', icon: FileText },
  { title: 'Expiring in 30 days', description: 'Require attention', icon: Clock },
  { title: 'Expired', description: 'Action required', icon: CircleAlert },
  { title: 'Valid documents', description: 'No action needed', icon: CircleCheck },
  { title: 'System status', description: 'Sync overview', icon: Activity },
];
const emptyFilters = { search: '', documentTitle: '', clientName: '' };

export default function DocumentsPage() {
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState({ ...emptyFilters, page: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const { data, isPending, isError, error, refetch, isFetching } = useDocuments(filters);
  const documents = data?.data ?? [];
  const total = data?.page?.total ?? 0;
  const totalPages = Math.max(1, data?.page?.totalPages ?? 1);
  const currentPage = data?.page?.page ?? filters.page;
  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  function applyFilters(event) {
    event.preventDefault();
    setFilters({ ...Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])), page: 1 });
  }
  function pageProps(page, disabled = false) {
    return {
      href: '#', 'aria-disabled': disabled, tabIndex: disabled ? -1 : 0,
      className: `rounded-full ${disabled ? 'pointer-events-none opacity-50' : ''}`,
      onClick: (event) => { event.preventDefault(); if (!disabled) setFilters((previous) => ({ ...previous, page })); },
    };
  }
  return <div className="space-y-6">
    <PageHeader title="Documents / Renewals" description="Track and manage client documents and expiry dates in one place." />
    <section aria-label="Document overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map(({ title, description, icon: Icon }) => <Card key={title} className="gap-0 border-border-default bg-surface-primary p-5 shadow-none">
        <div className="flex items-center gap-3"><span className="rounded-lg bg-accent p-2 text-primary"><Icon className="size-5" aria-hidden="true" /></span><h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{title}</h2></div>
        <p className="mt-4 text-4xl font-bold tracking-tight text-primary">0</p>
        <p className="mt-1 text-caption text-text-secondary">{description}</p>
      </Card>)}
    </section>
    <section aria-label="Document list" className="overflow-hidden rounded-xl border border-border-default bg-surface-primary">
      <form onSubmit={applyFilters} className="space-y-4 border-b border-border-default p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="mr-auto text-heading-sm font-semibold">All documents</h2>
          <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-text-muted" aria-hidden="true" /><Input aria-label="Search documents or clients" placeholder="Search documents or clients" maxLength={100} value={draft.search} onChange={(event) => setDraft({ ...draft, search: event.target.value })} className="min-h-11 pl-9" /></div>
          <Button type="submit" className="min-h-11 rounded-full px-6">Search</Button>
          <Button type="button" variant="outline" className="min-h-11 rounded-full px-6" aria-expanded={showFilters} aria-controls="document-filters" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal className="size-4" />Filters</Button>
        </div>
        {showFilters && <div id="document-filters" className="grid items-end gap-4 sm:grid-cols-3">
          <label className="space-y-2 text-sm font-medium">Document title<Input className="min-h-11" maxLength={100} value={draft.documentTitle} onChange={(event) => setDraft({ ...draft, documentTitle: event.target.value })} placeholder="Filter by title" /></label>
          <label className="space-y-2 text-sm font-medium">Client name<Input className="min-h-11" maxLength={100} value={draft.clientName} onChange={(event) => setDraft({ ...draft, clientName: event.target.value })} placeholder="Filter by client" /></label>
          <Button type="button" variant="ghost" className="min-h-11 rounded-full" onClick={() => { setDraft(emptyFilters); setFilters({ ...emptyFilters, page: 1 }); }}>Clear filters</Button>
        </div>}
      </form>
      {isError ? <div role="alert" className="space-y-3 p-8 text-center"><p className="font-semibold">Unable to load documents</p><p className="text-sm text-text-secondary">{error?.response?.status === 403 ? 'Your account does not have permission to view this document list.' : 'Please try again.'}</p><Button variant="outline" className="rounded-full" onClick={() => refetch()} disabled={isFetching}>Try again</Button></div> : <>
        <div className="overflow-x-auto" aria-busy={isFetching}>
          <Table><TableHeader><TableRow className="bg-muted/40">{['Document', 'Client', 'Type', 'Issue date', 'Expiry date', 'Days remaining', 'Status'].map((heading) => <TableHead key={heading} className="text-xs uppercase tracking-wide text-text-secondary">{heading}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {isPending ? <TableRow><TableCell colSpan={7} className="h-40 text-center text-text-secondary"><span role="status">Loading documents…</span></TableCell></TableRow> : documents.length === 0 ? <TableRow><TableCell colSpan={7} className="h-40 text-center"><FileText className="mx-auto mb-3 size-7 text-text-muted" /><p className="font-medium">No documents found</p><p className="mt-1 text-sm text-text-secondary">Try a different search or clear your filters.</p>{filters.page > 1 && <Button variant="ghost" className="mt-3 rounded-full" onClick={() => setFilters({ ...filters, page: 1 })}>Back to first page</Button>}</TableCell></TableRow> : documents.map((document) => {
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
          <p className="shrink-0 text-sm text-text-secondary" role="status">{documents.length ? `${(currentPage - 1) * 50 + 1}–${(currentPage - 1) * 50 + documents.length}` : '0'} of {total} documents · 50 per page</p>
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
