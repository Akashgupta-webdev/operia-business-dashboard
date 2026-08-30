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
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function optionalValue(value) {
  return value?.trim() || null;
}

function nullableSection(section) {
  return Object.values(section).some(Boolean) ? section : null;
}

export function createClientMemberUpdateDefaultValues(member) {
  return {
    name: member?.name ?? "",
    memberType: member?.memberType ?? "",
    passport: {
      passportNumber: member?.passport?.passportNumber ?? "",
      passportIssueDate: toDateInputValue(member?.passport?.passportIssueDate),
      passportExpiryDate: toDateInputValue(member?.passport?.passportExpiryDate),
    },
    emirates: {
      emiratesId: member?.emirates?.emiratesId ?? "",
      emiratesIssueDate: toDateInputValue(member?.emirates?.emiratesIssueDate),
      emiratesExpiryDate: toDateInputValue(member?.emirates?.emiratesExpiryDate),
    },
    visa: {
      visaUIDNumber: member?.visa?.visaUIDNumber ?? "",
      visaIssueDate: toDateInputValue(member?.visa?.visaIssueDate),
      visaExpiryDate: toDateInputValue(member?.visa?.visaExpiryDate),
    },
    healthInsurance: {
      healthInsuranceCardNumber: member?.healthInsurance?.healthInsuranceCardNumber ?? "",
      healthInsuranceIssueDate: toDateInputValue(member?.healthInsurance?.healthInsuranceIssueDate),
      healthInsuranceExpiryDate: toDateInputValue(member?.healthInsurance?.healthInsuranceExpiryDate),
    },
  };
}

export function buildClientMemberUpdatePayload(values) {
  return {
    memberType: values.memberType || null,
    name: optionalValue(values.name),
    passport: nullableSection({
      passportNumber: optionalValue(values.passport.passportNumber)?.toUpperCase() ?? null,
      passportIssueDate: toApiDate(values.passport.passportIssueDate),
      passportExpiryDate: toApiDate(values.passport.passportExpiryDate),
    }),
    emirates: nullableSection({
      emiratesId: optionalValue(values.emirates.emiratesId),
      emiratesIssueDate: toApiDate(values.emirates.emiratesIssueDate),
      emiratesExpiryDate: toApiDate(values.emirates.emiratesExpiryDate),
    }),
    visa: nullableSection({
      visaUIDNumber: optionalValue(values.visa.visaUIDNumber),
      visaIssueDate: toApiDate(values.visa.visaIssueDate),
      visaExpiryDate: toApiDate(values.visa.visaExpiryDate),
    }),
    healthInsurance: nullableSection({
      healthInsuranceCardNumber: optionalValue(values.healthInsurance.healthInsuranceCardNumber),
      healthInsuranceIssueDate: toApiDate(values.healthInsurance.healthInsuranceIssueDate),
      healthInsuranceExpiryDate: toApiDate(values.healthInsurance.healthInsuranceExpiryDate),
    }),
  };
}
