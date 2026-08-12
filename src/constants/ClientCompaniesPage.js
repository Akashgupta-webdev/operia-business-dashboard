export const COMPANY_TYPE_OPTIONS = [
  { value: "MAINLAND", label: "Mainland" },
  { value: "FREE_ZONE", label: "Free zone" },
  { value: "OFFSHORE", label: "Offshore" },
];

export const CLIENT_COMPANIES_QUERY_KEY = ["client-companies"];
export const CLIENT_COMPANIES_PAGE_SIZE = 6;

export const COMPANY_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "UNDER_FORMATION", label: "Under formation" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CLOSED", label: "Closed" },
];

export const COMPANY_FORM_STEPS = [
  {
    title: "Company details",
    description: "Add the company identity and legal structure.",
    fields: ["client", "companyName", "tradeName", "legalName", "companyType", "freeZoneName"],
    optional: false,
  },
  {
    title: "Registration",
    description: "Record licence, establishment, VAT, and tax details.",
    fields: [
      "licence.number",
      "licence.activity",
      "licence.issueDate",
      "licence.expiryDate",
      "establishment.cardNumber",
      "establishment.cardExpiryDate",
      "vatTrnNumber",
      "corporateTaxRegistrationNumber",
    ],
    optional: true,
  },
  {
    title: "Contact",
    description: "Add the company contact information and address.",
    fields: ["companyEmail", "companyMobile", "address"],
    optional: true,
  },
  {
    title: "Banking & notes",
    description: "Complete the banking details, status, and internal notes.",
    fields: ["bankName", "accountName", "iban", "accountNumber", "companyStatus", "notes"],
    optional: true,
  },
];

export const CREATE_COMPANY_DEFAULT_VALUES = {
  client: "",
  companyName: "",
  tradeName: "",
  legalName: "",
  companyType: "",
  freeZoneName: "",
  licence: {
    number: "",
    activity: "",
    issueDate: "",
    expiryDate: "",
  },
  establishment: {
    cardNumber: "",
    cardExpiryDate: "",
  },
  vatTrnNumber: "",
  corporateTaxRegistrationNumber: "",
  companyEmail: "",
  companyMobile: "",
  address: "",
  bankName: "",
  accountName: "",
  iban: "",
  accountNumber: "",
  companyStatus: "ACTIVE",
  notes: "",
};
