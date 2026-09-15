
export const CLIENT_TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Company", value: "COMPANY" },
];

export const CLIENT_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Archived", value: "Archived" },
  { label: "Draft", value: "Draft" },
];

export const CLIENT_SORT_OPTIONS = [
  "Newest First",
  "Oldest First",
  "Name(A-Z)",
  "Name(Z-A)",
];

export const CLIENT_SETUP_STEPS = [
  { title: "Client details", description: "Identity & contact" },
  { title: "Company", description: "Business information" },
  { title: "Personnel", description: "Members & employees" },
  { title: "Vehicles", description: "Fleet registration" },
  { title: "Drivers", description: "Driver details" },
  { title: "Services", description: "Work requirements" },
  { title: "Documents", description: "Supporting files" },
  { title: "Payment", description: "Fees & collection" },
  { title: "Reminder", description: "Dates & follow-up" },
  { title: "Review", description: "Confirm & complete" },
];

export const NATIONALITY_OPTIONS = [
  "United Arab Emirates",
  "India",
  "Pakistan",
  "Philippines",
  "Egypt",
  "United Kingdom",
  "Germany",
];

export const CLIENT_EDIT_TYPE_OPTIONS = [
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Company", value: "COMPANY" },
];

export const PREFERRED_COMMUNICATION_OPTIONS = ["Email", "Whatsapp", "Call"];

export const MEMBER_TYPE_OPTIONS = [
  "Partner",
  "Employee/Staff",
  "Manger",
  "Director",
  "Other",
];

export const SERVICE_CATEGORY_OPTIONS = [
  "Business Setup",
  "Visa & Immigration",
  "Tax & Accounting",
  "PRO Services",
  "Legal & Advisory",
];

export const SERVICE_PACKAGE_OPTIONS = [
  "Mainland LLC Company Formation Package",
  "Freezone Company Formation Package",
  "Offshore Company Setup Package",
  "Trade Licence Renewal Package",
  "Trade Licence Amendment / Partner Change",
  "Instant / Freelance License Setup",
  "Bank Account Opening Assistance Package",
  "Branch Office / Foreign Entity Setup",
  "Custom Business Setup Service",
  "Investor / Partner 2-Year Visa Package",
  "Employment Visa (Normal / Skilled) Package",
  "Golden Visa (10-Year Residency) Package",
  "Family / Dependent Visa Package",
  "Domestic Worker / Maid Visa Package",
  "Visa Cancellation / Change of Status Package",
  "Emirates ID & VIP Medical Assistance",
  "Tourist / Visit Visa Extension Package",
  "Custom Visa & Immigration Service",
  "Corporate Tax Registration Package",
  "Annual Corporate Tax Return Filing",
  "VAT Registration Package",
  "VAT Deregistration Package",
  "Quarterly VAT Return Filing Package",
  "Monthly Bookkeeping & Accounting Package",
  "Financial Audit & Balance Sheet Assistance",
  "Tax Assessment & Advisory Consultation",
  "Custom Tax & Accounting Service",
  "Establishment Card (New / Renewal) Package",
  "MOHRE / Labour File & Quota Processing",
  "Signature Card Issuance & E-Sign Activation",
  "Municipality / Civil Defence / External Approvals",
  "Legal Translation & Notarization Package",
  "Customs Code (New / Renewal) Package",
  "Tenancy Contract / Ejari Registration Assistance",
  "Commercial Vehicle / Fleet Approval Assistance",
  "Custom PRO Service",
  "MOA & Shareholder Agreement Drafting / Amendment",
  "Power of Attorney (POA) & Board Resolution",
  "Trademark Registration & Brand Protection",
  "Company Liquidation / Deregistration Package",
  "Commercial Contract Review & Legal Advisory",
  "UBO & ESR (Economic Substance) Compliance Filing",
  "Share Transfer / Capital Increase Agreement",
  "Custom Legal & Advisory Service",
];

export const SERVICE_STATUS_OPTIONS = [
  "In Progress",
  "Pending",
  "Completed",
  "Cancelled",
];

export const SERVICE_PAYMENT_STATUS_OPTIONS = ["Unpaid", "Partial", "Paid"];
export const DOCUMENT_TYPE_OPTIONS = [
  "Passport",
  "Emirates ID",
  "Visa",
  "Trade Licence",
  "Other",
];
export const PAYMENT_STATUS_OPTIONS = [
  "Unpaid",
  "Partially Paid",
  "Paid",
  "Credit",
];
export const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "Bank Transfer",
  "Credit Card",
  "Cheque",
];
export const REMIND_BEFORE_OPTIONS = [
  "1 day before",
  "3 day before",
  "7 day before",
  "14 day before",
  "30 before day",
];
export const REMINDER_PRIORITY_OPTIONS = ["Low", "Normal", "High"];

export const MAX_RELATED_ITEMS = 100;
export const MAX_DOCUMENTS = 10;
export const MAX_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024;
