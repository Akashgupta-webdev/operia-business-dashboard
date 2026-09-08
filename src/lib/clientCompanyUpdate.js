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
    tradeLicence: {
      tradeLicenceNo: company?.tradeLicence === undefined ? company?.tradeLicenceNumber ?? "" : company.tradeLicence?.tradeLicenceNo ?? "",
      tradeLicenceExpiry: toDateInputValue(company?.tradeLicence === undefined ? company?.licenceExpiryDate : company.tradeLicence?.tradeLicenceExpiry),
    },
    establishment: {
      establishmentCard: company?.establishment?.establishmentCard ?? "",
      establishmentCardExpiry: toDateInputValue(company?.establishment?.establishmentCardExpiry),
    },
    vatTaxRegistrationNumber: company?.vatTaxRegistrationNumber ?? "",
    corporateTaxNumber: company?.corporateTaxNumber ?? "",
  };
}

export function buildClientCompanyUpdatePayload(values, dirtyFields) {
  const payload = {
    companyName: values.companyName?.trim(),
    tradeLicence: {
      tradeLicenceNo: optionalValue(values.tradeLicence?.tradeLicenceNo),
      tradeLicenceExpiry: toApiDate(values.tradeLicence?.tradeLicenceExpiry),
    },
    establishment: {
      establishmentCard: optionalValue(values.establishment?.establishmentCard),
      establishmentCardExpiry: toApiDate(values.establishment?.establishmentCardExpiry),
    },
    vatTaxRegistrationNumber: optionalValue(values.vatTaxRegistrationNumber),
    corporateTaxNumber: optionalValue(values.corporateTaxNumber),
  };

  if (!dirtyFields) return payload;

  return Object.fromEntries(Object.entries(payload).flatMap(([key, value]) => {
    if (!dirtyFields[key]) return [];
    if (value && typeof value === "object") {
      const changedFields = Object.fromEntries(Object.entries(value)
        .filter(([field]) => dirtyFields[key] === true || dirtyFields[key][field]));
      return Object.keys(changedFields).length ? [[key, changedFields]] : [];
    }
    return [[key, value]];
  }));
}
