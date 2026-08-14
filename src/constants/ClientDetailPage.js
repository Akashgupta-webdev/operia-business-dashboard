export const CLIENT_PROFILE_IMAGE = "https://placehold.net/avatar.svg";

export const CLIENT_DETAIL_TABS = [
  { value: "personal", label: "Personal Info" },
  { value: "companies", label: "Companies" },
  { value: "services", label: "Services" },
  { value: "documents", label: "Documents" },
  { value: "insurance", label: "Visas & Insurance" },
  { value: "history", label: "History" },
];

export const CLIENT_STATUS_STYLES = {
  ACTIVE: "bg-success-container text-success-container-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
  PROSPECT: "bg-warning-container text-warning-container-foreground",
  ARCHIVED: "bg-surface-container-highest text-on-surface-variant",
};

export const CLIENT_SERVICES_QUERY_KEY = ["client-services"];

export const SERVICE_FILTER_STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "NOT_STARTED", label: "Not started" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "COMPLETE", label: "Complete" },
];

export const SERVICE_STATUS_STYLES = {
  NOT_STARTED: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-warning-container text-warning-container-foreground",
  SUBMITTED: "bg-accent text-accent-foreground",
  COMPLETE: "bg-success-container text-success-container-foreground",
};
