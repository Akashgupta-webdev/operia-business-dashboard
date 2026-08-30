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

export function createClientVehicleUpdateDefaultValues(vehicle) {
  return {
    registrationNumer: vehicle?.registrationNumer ?? "",
    policyNumber: vehicle?.policyNumber ?? "",
    insuranceExpiry: toDateInputValue(vehicle?.insuranceExpiry),
    tcNumber: vehicle?.tcNumber ?? "",
    registrationExpiry: toDateInputValue(vehicle?.registrationExpiry),
  };
}

export function buildClientVehicleUpdatePayload(values) {
  return {
    registrationNumer: optionalValue(values.registrationNumer),
    tcNumber: optionalValue(values.tcNumber),
    policyNumber: optionalValue(values.policyNumber),
    registrationExpiry: toApiDate(values.registrationExpiry),
    insuranceExpiry: toApiDate(values.insuranceExpiry),
  };
}
