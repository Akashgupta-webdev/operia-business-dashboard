const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const API_DATE_PATTERN = /^\d{2}-\d{2}-\d{4}$/;

function toDateInputValue(value) {
  if (!value) return "";
  if (DATE_INPUT_PATTERN.test(value)) return value;
  if (API_DATE_PATTERN.test(value)) {
    const [day, month, year] = value.split("-");
    return `${year}-${month}-${day}`;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toApiDate(value) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function trimOrUndefined(value) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function buildIdentity(values, fieldNames) {
  const identity = Object.fromEntries(fieldNames.flatMap((field) => {
    const value = field.endsWith("Date") ? toApiDate(values[field]) : trimOrUndefined(values[field]);
    return value ? [[field, value]] : [];
  }));

  return Object.keys(identity).length ? identity : null;
}

export function createClientUpdateDefaultValues(client) {
  return {
    name: client?.name ?? "",
    clientType: client?.clientType ?? "INDIVIDUAL",
    nationality: client?.nationality ?? "",
    preferredCommunicationMethod: client?.preferredCommunicationMethod ?? "",
    mobileNumber: client?.mobileNumber ?? "",
    whatsappNumber: client?.whatsappNumber ?? "",
    emailAddress: client?.emailAddress ?? "",
    emirates: {
      emiratesId: client?.emirates?.emiratesId ?? "",
      emiratesIssueDate: toDateInputValue(client?.emirates?.emiratesIssueDate),
      emiratesExpiryDate: toDateInputValue(client?.emirates?.emiratesExpiryDate),
    },
    passport: {
      passportNumber: client?.passport?.passportNumber ?? "",
      passportIssueDate: toDateInputValue(client?.passport?.passportIssueDate),
      passportExpiryDate: toDateInputValue(client?.passport?.passportExpiryDate),
    },
    visa: {
      visaUIDNumber: client?.visa?.visaUIDNumber ?? "",
      visaIssueDate: toDateInputValue(client?.visa?.visaIssueDate),
      visaExpiryDate: toDateInputValue(client?.visa?.visaExpiryDate),
    },
    healthInsurance: {
      healthInsuranceCardNumber: client?.healthInsurance?.healthInsuranceCardNumber ?? "",
      healthInsuranceIssueDate: toDateInputValue(client?.healthInsurance?.healthInsuranceIssueDate),
      healthInsuranceExpiryDate: toDateInputValue(client?.healthInsurance?.healthInsuranceExpiryDate),
    },
  };
}

export function buildClientUpdatePayload(values) {
  return {
    name: values.name.trim(),
    clientType: values.clientType,
    nationality: trimOrUndefined(values.nationality),
    preferredCommunicationMethod: trimOrUndefined(values.preferredCommunicationMethod),
    mobileNumber: trimOrUndefined(values.mobileNumber) ?? null,
    whatsappNumber: trimOrUndefined(values.whatsappNumber) ?? null,
    emailAddress: trimOrUndefined(values.emailAddress)?.toLowerCase() ?? null,
    emirates: buildIdentity(values.emirates, ["emiratesId", "emiratesIssueDate", "emiratesExpiryDate"]),
    passport: buildIdentity(values.passport, ["passportNumber", "passportIssueDate", "passportExpiryDate"]),
    visa: buildIdentity(values.visa, ["visaUIDNumber", "visaIssueDate", "visaExpiryDate"]),
    healthInsurance: buildIdentity(values.healthInsurance, ["healthInsuranceCardNumber", "healthInsuranceIssueDate", "healthInsuranceExpiryDate"]),
  };
}
