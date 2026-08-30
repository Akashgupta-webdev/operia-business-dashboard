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

export function createClientServiceUpdateDefaultValues(service) {
  const price = service?.packagePrice?.$numberDecimal ?? service?.packagePrice;
  return {
    category: service?.category ?? "",
    package: service?.package ?? "",
    status: service?.status ?? "",
    packagePrice: price === undefined || price === null ? "" : String(price),
    paymentStatus: service?.paymentStatus ?? "",
    targetCompletionDate: toDateInputValue(service?.targetCompletionDate),
    notes: Array.isArray(service?.notes) ? service.notes.join("\n") : (service?.notes ?? ""),
  };
}

export function buildClientServiceUpdatePayload(values) {
  const notes = values.notes.split("\n").map((note) => note.trim()).filter(Boolean);
  return {
    category: values.category || null,
    package: values.package || null,
    status: values.status || null,
    packagePrice: optionalValue(values.packagePrice),
    paymentStatus: values.paymentStatus || null,
    targetCompletionDate: toApiDate(values.targetCompletionDate),
    notes: notes.length ? notes : null,
  };
}
