export const RENEWALS_PAGE_SIZE = 20;
export const RENEWALS_DUE_SOON_DAYS = 30;
export const RENEWAL_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "tradeLicence", label: "Trade Licence" },
  { value: "establishment", label: "Establishment Card" },
  { value: "visa", label: "Visa" },
  { value: "emirates", label: "Emirates ID" },
  { value: "passport", label: "Passport" },
  { value: "healthInsurance", label: "Health Insurance" },
  { value: "vehicleRegistration", label: "Vehicle Registration" },
  { value: "vehicleInsurance", label: "Vehicle Insurance" },
  { value: "driverLicence", label: "Driving Licence" },
  { value: "document", label: "Document" },
];
export const RENEWAL_STATUSES = [
  { value: "all", label: "All" },
  { value: "expired", label: "Expired" },
  { value: "due-soon", label: "Due Soon" },
  { value: "valid", label: "Valid" },
];
export const RENEWAL_TONES = {
  primary: "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-500",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  success: "bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500",
  neutral: "bg-surface-secondary text-text-secondary",
};
