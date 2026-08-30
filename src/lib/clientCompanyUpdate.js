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

export function createClientCompanyUpdateDefaultValues(company) {
  return {
    companyName: company?.companyName ?? "",
    tradeLicenceNumber: company?.tradeLicenceNumber ?? "",
    licenceExpiryDate: toDateInputValue(company?.licenceExpiryDate),
    vatTaxRegistrationNumber: company?.vatTaxRegistrationNumber ?? "",
    corporateTaxNumber: company?.corporateTaxNumber ?? "",
  };
}

export function buildClientCompanyUpdatePayload(values) {
  return {
    companyName: values.companyName.trim(),
    tradeLicenceNumber: optionalValue(values.tradeLicenceNumber),
    licenceExpiryDate: toApiDate(values.licenceExpiryDate),
    vatTaxRegistrationNumber: optionalValue(values.vatTaxRegistrationNumber),
    corporateTaxNumber: optionalValue(values.corporateTaxNumber),
  };
}
