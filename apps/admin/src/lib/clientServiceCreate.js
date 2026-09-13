function toApiDate(value) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function optionalValue(value) {
  return value?.trim() || undefined;
}

export function createClientServiceCreateDefaultValues() {
  return {
    category: "",
    package: "",
    status: "",
    packagePrice: "",
    paymentStatus: "",
    targetCompletionDate: "",
    notes: "",
  };
}

export function buildClientServiceCreatePayload(values) {
  const notes = (values.notes || "").split("\n").map((note) => note.trim()).filter(Boolean);
  return Object.fromEntries(Object.entries({
    category: values.category || undefined,
    package: values.package || undefined,
    status: values.status || undefined,
    packagePrice: optionalValue(values.packagePrice),
    paymentStatus: values.paymentStatus || undefined,
    targetCompletionDate: toApiDate(values.targetCompletionDate),
    notes: notes.length ? notes : undefined,
  }).filter(([, value]) => value !== undefined));
}
