
export const FINANCE_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((label, index) => ({ label, value: String(index + 1) }));

export const EXPENSE_CATEGORIES = [
  "Government & Authority Fees",
  "Typing & Amer Centers",
  "PRO Processing & Courier",
  "Office Rent & Utilities",
  "Software & Cloud Tools",
  "Salaries & Professional Fees",
  "Miscellaneous Operations",
];

export const EXPENSE_PAYMENT_METHODS = [
  "Bank Transfer / Online",
  "Corporate Credit Card",
  "Cash / Petty Cash",
  "PRO Reimbursement",
];
