import { useState } from "react";
import { ArrowRight, Building2, CheckSquare, MessageSquare, Search, UserRound } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import { Input } from "@operio/ui/components/input";
import { cn } from "@operio/ui/lib/utils";
// Requests will be populated when the support API is connected.
const requests = [];

export default function RemindersPage() {
  const [workspace, setWorkspace] = useState("inbox");
  const [status, setStatus] = useState("Open");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const openCount = requests.filter((request) => request.status === "Open").length;
  const closedCount = requests.length - openCount;
  const newCount = requests.filter((request) => request.newReply).length;
  const visibleRequests = requests.filter((request) => request.status === status && [request.id, request.title, request.client, request.company].some((value) => value.toLowerCase().includes(search.trim().toLowerCase())));

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] space-y-4 bg-primary-50/20 p-4 sm:p-5">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-text-primary"><MessageSquare aria-hidden="true" className="size-6 shrink-0 text-primary" />Support &amp; Tasks Center</h1>
          <p className="mt-1 text-xs text-text-secondary">Centralized client support requests, real-time message inbox, and CRM operational tasks.</p>
        </div>
        <div role="group" aria-label="Support workspace" className="flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-border-default bg-surface-primary p-1">
          <Button type="button" aria-pressed={workspace === "inbox"} variant={workspace === "inbox" ? "default" : "ghost"} onClick={() => setWorkspace("inbox")} className="h-8 rounded-lg px-4 text-xs font-semibold"><MessageSquare aria-hidden="true" className="size-4" />Support &amp; Chat Inbox<span className={cn("ml-1 rounded-full px-2 py-0.5 text-[10px]", workspace === "inbox" ? "bg-white/20" : "bg-primary-50 text-primary")}>{newCount} New</span></Button>
          <Button type="button" aria-pressed={workspace === "tasks"} variant={workspace === "tasks" ? "default" : "ghost"} onClick={() => setWorkspace("tasks")} className="h-8 rounded-lg px-4 text-xs font-semibold"><CheckSquare aria-hidden="true" className="size-4" />CRM Tasks (0)</Button>
        </div>
      </header>

      <section aria-label="Support summary" className="grid gap-3 sm:grid-cols-3">
        {[{ label: "Active Requests", value: openCount, color: "text-text-primary" }, { label: "Needs Response", value: newCount, color: "text-danger-600" }, { label: "Resolved / Closed", value: closedCount, color: "text-success-600" }].map(({ label, value, color }) => (
          <Card key={label} className="gap-2 rounded-xl border border-primary-100/60 bg-surface-primary p-4 shadow-card ring-0"><h2 className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{label}</h2><p className={cn("text-2xl font-extrabold leading-7 tabular-nums", color)}>{value}</p></Card>
        ))}
      </section>

      {workspace === "inbox" ? <>
        <Card className="flex-col gap-3 rounded-xl border border-border-default bg-surface-primary p-3 shadow-card ring-0 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Request status" className="flex flex-wrap gap-2">
            {[{ value: "Open", label: `Open Requests (${openCount})` }, { value: "Closed", label: `Closed Chats (${closedCount})` }].map((option) => <Button key={option.value} type="button" aria-pressed={status === option.value} variant={status === option.value ? "default" : "ghost"} onClick={() => setStatus(option.value)} className="h-8 rounded-full px-4 text-xs font-semibold">{option.label}</Button>)}
          </div>
          <div className="relative w-full md:max-w-sm"><Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" /><Input type="search" aria-label="Search support requests" placeholder="Search ticket #, client, company..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 min-h-8! bg-primary-50/20 pl-9 text-xs md:text-xs" /></div>
        </Card>

        <Card className="gap-0 overflow-hidden rounded-xl border border-primary-100/60 bg-surface-primary py-0 shadow-card ring-0">
          {visibleRequests.length ? <ul className="divide-y divide-border-default/60">
            {visibleRequests.map((request) => <li key={request.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2"><span className="rounded bg-primary-50 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">{request.id}</span><h2 className="text-xs font-bold text-text-primary">{request.title}</h2>{request.newReply && <span className="rounded-full bg-danger-100 px-2 py-0.5 text-[9px] font-bold text-danger-700">NEW REPLY</span>}</div>
                <p className="text-xs text-text-secondary">{request.message}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-text-muted"><span className="inline-flex items-center gap-1"><UserRound aria-hidden="true" className="size-3 text-primary" />{request.client}</span><span className="inline-flex items-center gap-1"><Building2 aria-hidden="true" className="size-3" />{request.company}</span><span>Category: {request.category}</span><span>{request.date}</span></div>
              </div>
              <div className="flex shrink-0 items-center gap-3 self-end lg:self-auto"><span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold", request.status === "Open" ? "border-info-100 bg-info-50 text-info-600" : "border-success-100 bg-success-50 text-success-600")}>{request.status}</span><Button type="button" onClick={() => setSelectedRequest(request)} className="h-8 rounded-full px-4 text-xs font-semibold">Open Chat<ArrowRight aria-hidden="true" className="size-3.5" /></Button></div>
            </li>)}
          </ul> : <div role="status" className="px-4 py-10 text-center"><Search aria-hidden="true" className="mx-auto mb-2 size-6 text-text-muted" /><h2 className="text-sm font-semibold">{search.trim() ? "No matching requests" : status === "Open" ? "No open requests" : "No closed chats"}</h2><p className="mt-1 text-xs text-text-secondary">{search.trim() ? "Try another ticket number, client, or company." : status === "Open" ? "New support requests will appear here." : "Resolved conversations will appear here."}</p></div>}
        </Card>
      </> : <Card className="items-center gap-2 border border-border-default bg-surface-primary px-4 py-10 text-center ring-0"><CheckSquare aria-hidden="true" className="size-7 text-text-muted" /><h2 className="text-sm font-semibold">No CRM tasks yet</h2><p className="text-xs text-text-secondary">Your operational tasks will appear here.</p></Card>}

      <Dialog open={Boolean(selectedRequest)} onOpenChange={(open) => { if (!open) setSelectedRequest(null); }}>
        <DialogContent className="p-5 sm:max-w-xl">
          <DialogHeader className="pr-8"><DialogTitle className="text-base">{selectedRequest?.title}</DialogTitle><DialogDescription>{selectedRequest?.id} · {selectedRequest?.client}</DialogDescription></DialogHeader>
          <div className="my-5 rounded-xl bg-primary-50 p-4"><p className="text-sm text-text-primary">{selectedRequest?.message}</p><p className="mt-2 text-xs text-text-muted">{selectedRequest?.date}</p></div>
          <p className="text-xs text-text-secondary">Chat preview. Replies will be available when messaging is connected.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
