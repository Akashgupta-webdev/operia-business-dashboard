import {
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileClock,
  FileWarning,
  Landmark,
  ShieldCheck,
  Stamp,
  Users,
} from "lucide-react";

export const dashboardMetrics = [
  { label: "Total Clients", value: "1,240", helper: "+12 this month", icon: Users, tone: "primary" },
  { label: "Total Companies", value: "856", helper: "+4 this month", icon: Building2, tone: "primary" },
  { label: "Active Services", value: "842", helper: "+5 this month", icon: BriefcaseBusiness, tone: "primary" },
  { label: "Pending Apps", value: "156", helper: "Awaiting approval", icon: FileClock, tone: "warning" },
  { label: "Expiring Soon", value: "24", helper: "Next 30 days", icon: BellRing, tone: "warning" },
  { label: "Expired Docs", value: "8", helper: "Action required", icon: FileWarning, tone: "destructive" },
  { label: "VAT Filings", value: "12", helper: "Due this month", icon: Landmark, tone: "primary" },
  { label: "Corp Tax", value: "5", helper: "Upcoming", icon: ClipboardCheck, tone: "primary" },
  { label: "Visa Expiries", value: "18", helper: "Renewals pending", icon: Stamp, tone: "warning" },
  { label: "Insurance", value: "32", helper: "Policy renewals", icon: ShieldCheck, tone: "primary" },
  { label: "Overdue", value: "14", helper: "Critical tasks", icon: CalendarClock, tone: "destructive" },
  { label: "Completed", value: "2,450", helper: "Lifetime total", icon: BadgeCheck, tone: "success" },
];

const clients = [
  ["Ahmed Khan", "AK", "ABC Trading LLC"],
  ["Sarah Jenkins", "SJ", "Nexus Global"],
  ["John Doe", "JD", "Horizon Tech"],
  ["Maria Garcia", "MG", "Solar Solutions"],
  ["Omar Farooq", "OF", "Crescent Holdings"],
  ["Layla Hassan", "LH", "Palm Ventures"],
  ["David Miller", "DM", "Summit Advisory"],
  ["Aisha Rahman", "AR", "Bluewater Logistics"],
  ["Ravi Mehta", "RM", "Vertex Systems"],
  ["Noor Al Ali", "NA", "Emirates Retail"],
  ["James Wilson", "JW", "Atlas Consulting"],
  ["Fatima Zahra", "FZ", "Pearl Healthcare"],
];

const actionTypes = [
  ["VAT Filing", "vat"],
  ["Visa Renewal", "visa"],
  ["Tax Compliance", "tax"],
  ["Insurance Renewal", "insurance"],
  ["Trade License Update", "documents"],
  ["Emirates ID Update", "documents"],
];

const statuses = [
  ["Due Soon", "due-soon"],
  ["Pending", "pending"],
  ["Active / Paid", "active"],
  ["Overdue", "overdue"],
  ["Completed", "completed"],
];

const avatarClasses = [
  "bg-accent text-accent-foreground",
  "bg-success-container text-success-container-foreground",
  "bg-warning-container text-warning-container-foreground",
  "bg-destructive-container text-destructive-container-foreground",
];

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

const demoToday = new Date("2026-08-10T00:00:00Z");

export const dashboardActions = Array.from({ length: 60 }, (_, index) => {
  const [client, initials, company] = clients[index % clients.length];
  const [action, service] = actionTypes[index % actionTypes.length];
  const daysUntilDue = ((index * 7) % 88) - 14;
  const dueDate = new Date(demoToday);
  dueDate.setUTCDate(dueDate.getUTCDate() + daysUntilDue);

  let [status, statusKey] = statuses[index % statuses.length];
  if (daysUntilDue < 0 && index % 3 === 0) [status, statusKey] = ["Overdue", "overdue"];

  return {
    id: index + 1,
    client,
    initials,
    company,
    action,
    service,
    status,
    statusKey,
    daysUntilDue,
    dueDateLabel: formatDate(dueDate),
    period: ["today", "week", "month"][index % 3],
    avatarClass: avatarClasses[index % avatarClasses.length],
  };
});
