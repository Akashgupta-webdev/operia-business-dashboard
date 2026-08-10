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
