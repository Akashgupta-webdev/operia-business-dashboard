export const CLIENT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "ARCHIVED", label: "Archived" },
];

export const PREFERRED_COMMUNICATION_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "CALL", label: "Call" },
];

export const CREATE_CLIENT_DEFAULT_VALUES = {
  name: "",
  mobileNumber: "",
  whatsappNumber: "",
  emailAddress: "",
  nationality: "",
  emiratesIdNumber: "",
  passportNumber: "",
  address: "",
  preferredCommunicationMethod: "",
  notes: "",
  clientStatus: "ACTIVE",
};

export const CLIENTS_PAGE_SIZE = 25;
export const CLIENTS_QUERY_KEY = ["clients"];

export const CLIENT_TYPE_OPTIONS = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COMPANY", label: "Company" },
];

export const COMPANY_TYPE_OPTIONS = [
  { value: "MAINLAND", label: "Mainland" },
  { value: "FREE_ZONE", label: "Free zone" },
  { value: "OFFSHORE", label: "Offshore" },
];

export const SERVICE_STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not started" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "COMPLETE", label: "Complete" },
];

const text = (name, label, placeholder) => ({ name, label, type: "text", placeholder });
const date = (name, label) => ({ name, label, type: "date" });
const number = (name, label, placeholder) => ({ name, label, type: "number", placeholder });
const select = (name, label, options) => ({ name, label, type: "select", options });

const requestTypeOptions = ["NEW", "RENEWAL", "AMENDMENT"].map((value) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() }));

export const SERVICE_CATEGORIES = [
  {
    value: "TRADE_LICENCE_NEW_RENEWAL_AMENDMENT",
    label: "Trade Licence (New / Renewal / Amendment)",
    group: "Company Documents",
    fields: [select("licenceType", "Licence type", requestTypeOptions), text("licenceNumber", "Licence number"), date("licenceIssueDate", "Licence issue date"), date("licenceExpiryDate", "Licence expiry date"), text("applicationNumber", "Application number"), date("submissionDate", "Submission date"), text("authorityDepartment", "Authority / department")],
  },
  {
    value: "VAT_REGISTRATION", label: "VAT Registration", group: "Company Documents",
    fields: [text("tradeLicenceNumber", "Trade licence number"), text("vatTrnAfterApproval", "VAT TRN (after approval)"), select("registrationType", "Registration type", [{ value: "MANDATORY", label: "Mandatory" }, { value: "VOLUNTARY", label: "Voluntary" }]), date("effectiveRegistrationDate", "Effective registration date"), text("applicationNumber", "Application number"), date("submissionDate", "Submission date")],
  },
  {
    value: "VAT_DEREGISTRATION", label: "VAT Deregistration", group: "Company Documents",
    fields: [text("vatTrn", "VAT TRN"), text("deregistrationReason", "Deregistration reason"), text("applicationNumber", "Application number"), date("applicationDate", "Application date"), date("effectiveDeregistrationDate", "Effective deregistration date")],
  },
  {
    value: "CORPORATE_TAX_REGISTRATION", label: "Corporate Tax Registration", group: "Company Documents",
    fields: [text("ctRegistrationNumber", "CT registration number"), date("financialYearStartDate", "Financial year start date"), date("financialYearEndDate", "Financial year end date"), date("registrationDate", "Registration date"), text("applicationNumber", "Application number"), date("submissionDate", "Submission date")],
  },
  {
    value: "ESTABLISHMENT_CARD_NEW_RENEWAL", label: "Establishment Card (New / Renewal)", group: "Company Documents",
    fields: [text("establishmentCardNumber", "Establishment card number"), date("issueDate", "Issue date"), date("expiryDate", "Expiry date"), text("applicationNumber", "Application number"), date("submissionDate", "Submission date")],
  },
  {
    value: "SIGNATURE_CARD_NEW_RENEWAL", label: "Signature Card (New / Renewal)", group: "Company Documents",
    fields: [text("signatoryName", "Signatory name"), text("signatureCardNumber", "Signature card number"), date("issueDate", "Issue date"), date("expiryDate", "Expiry date"), text("applicationNumber", "Application number")],
  },
  {
    value: "SIGNATURE_CARD_ACTIVATION", label: "Signature Card Activation", group: "Company Documents",
    fields: [text("signatoryName", "Signatory name"), text("signatureCardNumber", "Signature card number"), date("activationDate", "Activation date"), text("applicationNumber", "Application number")],
  },
  {
    value: "BANK_ACCOUNT_ASSISTANCE", label: "Bank Account Assistance", group: "Company Documents",
    fields: [text("bankName", "Bank name"), text("accountType", "Account type"), date("applicationDate", "Application date"), text("accountNumberIban", "Account number / IBAN")],
  },
  {
    value: "VAT_FILING_QUARTERLY_MONTHLY", label: "VAT Filing (Quarterly / Monthly)", group: "Tax & Compliance",
    fields: [text("vatTrn", "VAT TRN"), date("taxPeriodStartDate", "Tax period start date"), date("taxPeriodEndDate", "Tax period end date"), date("filingDueDate", "Filing due date"), number("outputVatAmount", "Output VAT amount"), number("inputVatAmount", "Input VAT amount"), number("vatPayableRefundable", "VAT payable / refundable")],
  },
  {
    value: "VAT_PAYMENT_TRACKING", label: "VAT Payment Tracking", group: "Tax & Compliance",
    fields: [text("vatTrn", "VAT TRN"), text("taxPeriod", "Tax period"), number("vatAmount", "VAT amount"), date("paymentDueDate", "Payment due date"), number("amountPaid", "Amount paid"), date("paymentDate", "Payment date")],
  },
  {
    value: "CORPORATE_TAX_FILING_ANNUAL", label: "Corporate Tax Filing (Annual)", group: "Tax & Compliance",
    fields: [text("ctRegistrationNumber", "CT registration number"), text("financialYear", "Financial year"), date("filingDueDate", "Filing due date"), number("taxableIncome", "Taxable income"), number("taxPayable", "Tax payable"), date("filingDate", "Filing date")],
  },
  {
    value: "CORPORATE_TAX_PAYMENT_TRACKING", label: "Corporate Tax Payment Tracking", group: "Tax & Compliance",
    fields: [text("ctRegistrationNumber", "CT registration number"), text("taxPeriodFinancialYear", "Tax period / financial year"), number("taxAmount", "Tax amount"), date("paymentDueDate", "Payment due date"), date("paymentDate", "Payment date")],
  },
  {
    value: "INVESTOR_PARTNER_EMPLOYEE_VISA_NEW", label: "Investor / Partner / Employee Visa (New)", group: "Visa & Employee Services",
    fields: [text("employeeOrPerson", "Employee / person"), text("companyOrSponsor", "Company / sponsor"), text("visaType", "Visa type"), text("passportNumber", "Passport number"), text("applicationNumber", "Application number"), date("applicationDate", "Application date"), date("visaExpiryDate", "Visa expiry date")],
  },
  {
    value: "VISA_RENEWAL", label: "Visa Renewal", group: "Visa & Employee Services",
    fields: [text("employeeOrPerson", "Employee / person"), text("companyOrSponsor", "Company / sponsor"), text("visaType", "Visa type"), text("currentVisaNumber", "Current visa number"), date("currentExpiryDate", "Current expiry date"), text("applicationNumber", "Application number"), date("applicationDate", "Application date"), date("newVisaExpiryDate", "New visa expiry date")],
  },
  {
    value: "VISA_CANCELLATION", label: "Visa Cancellation", group: "Visa & Employee Services",
    fields: [text("employeeOrPerson", "Employee / person"), text("companyOrSponsor", "Company / sponsor"), text("visaNumber", "Visa number"), text("cancellationReason", "Cancellation reason"), date("cancellationDate", "Cancellation date"), text("applicationNumber", "Application number")],
  },
  {
    value: "STATUS_CHANGE", label: "Status Change", group: "Visa & Employee Services",
    fields: [text("employeeOrPerson", "Employee / person"), text("companyOrSponsor", "Company / sponsor"), text("currentVisaEntryPermit", "Current visa / entry permit"), text("newVisaType", "New visa type"), text("applicationNumber", "Application number"), date("applicationDate", "Application date"), date("statusChangeDate", "Status change date")],
  },
  {
    value: "MEDICAL_TEST", label: "Medical Test", group: "Visa & Employee Services",
    fields: [text("employeeOrPerson", "Employee / person"), text("company", "Company"), text("medicalType", "Medical type"), date("testDate", "Test date"), date("resultDate", "Result date"), text("medicalResult", "Medical result")],
  },
  {
    value: "EMIRATES_ID", label: "Emirates ID", group: "Visa & Employee Services",
    fields: [text("employeeOrPerson", "Employee / person"), text("company", "Company"), text("eidNumberAfterIssued", "EID number (after issued)"), text("applicationNumber", "Application number"), date("applicationDate", "Application date"), date("eidExpiryDate", "EID expiry date")],
  },
  {
    value: "HEALTH_INSURANCE", label: "Health Insurance", group: "Insurance & Others",
    fields: [text("insuredPerson", "Insured person"), text("company", "Company"), text("insuranceProvider", "Insurance provider"), text("policyNumber", "Policy number"), date("policyStartDate", "Policy start date"), date("policyExpiryDate", "Policy expiry date")],
  },
  {
    value: "ILOE_INSURANCE", label: "ILOE Insurance", group: "Insurance & Others",
    fields: [text("employeeOrPerson", "Employee / person"), text("company", "Company"), text("iloePolicyNumber", "ILOE policy number"), date("policyStartDate", "Policy start date"), date("policyExpiryDate", "Policy expiry date")],
  },
  {
    value: "BENEFICIARY_UPDATE", label: "Beneficiary Update", group: "Insurance & Others",
    fields: [text("employeeOrPerson", "Employee / person"), text("company", "Company"), text("beneficiaryName", "Beneficiary name"), text("relationship", "Relationship"), date("applicationDate", "Application date")],
  },
  {
    value: "TYPING_SERVICES", label: "Typing Services", group: "Other Services",
    fields: [text("companyOrPerson", "Company / person"), text("serviceType", "Service type"), text("applicationNumber", "Application number"), date("submissionDate", "Submission date"), text("authority", "Authority")],
  },
  {
    value: "IMMIGRATION_LABOUR_SERVICES", label: "Immigration / Labour Services", group: "Other Services",
    fields: [text("companyOrPerson", "Company / person"), text("serviceType", "Service type"), text("applicationNumber", "Application number"), date("submissionDate", "Submission date"), text("authority", "Authority")],
  },
  {
    value: "OTHER_CUSTOM_SERVICE", label: "Other / Custom Service", group: "Other Services",
    fields: [text("companyOrPerson", "Company / person"), text("serviceType", "Service type"), text("applicationNumber", "Application number"), date("startDate", "Start date"), date("dueDate", "Due date")],
  },
];

export const QUICK_ADD_DEFAULT_VALUES = {
  client: {
    clientType: "INDIVIDUAL", name: "", mobileNumber: "", whatsappNumber: "", emailAddress: "", nationality: "", passportNumber: "", emiratesIdNumber: "", preferredCommunicationMethod: "", address: "", notes: "", clientStatus: "ACTIVE",
  },
  company: {
    companyName: "", companyType: "", licence: { number: "", activity: "", issueDate: "", expiryDate: "" }, corporateTaxRegistrationNumber: "", vatTrnNumber: "", companyEmail: "", companyMobile: "", address: "", companyStatus: "ACTIVE",
  },
  service: { category: "", status: "NOT_STARTED", detail: {} },
  paymentEnabled: false,
  payment: { governmentFee: "", serviceFee: "", totalAmount: "", amountReceived: "", paymentMethod: "", paymentDate: "", paymentStatus: "" },
  reminderEnabled: false,
  reminder: { dueDate: "", reminderBefore: "", followUpsDate: "", notes: "" },
};
