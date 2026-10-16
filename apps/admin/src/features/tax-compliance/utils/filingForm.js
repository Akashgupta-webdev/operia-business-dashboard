export const decimalPattern = "-?[0-9]+(\\.[0-9]+)?";

export function decimalValue(value) {
  return String(value?.$numberDecimal ?? value ?? "");
}

export function monthInput(value = "") {
  if (/^\d{2}-\d{4}$/.test(value)) return `${value.slice(3)}-${value.slice(0, 2)}`;
  return value.slice(0, 7);
}

export function dateInput(value = "") {
  if (!value) return "";
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value.split("-").reverse().join("-");
  return value.slice(0, 10);
}

export function initialFilingForm(filing) {
  return {
    periodStart: monthInput(filing?.periodStart),
    periodEnd: monthInput(filing?.periodEnd),
    status: filing?.status ? filing.status[0].toUpperCase() + filing.status.slice(1).toLowerCase() : "Pending",
    input: decimalValue(filing?.input),
    output: decimalValue(filing?.output),
    filingDate: dateInput(filing?.filingDate),
    nextDueDate: dateInput(filing?.nextDueDate),
  };
}

export function filingPayload(form, initial) {
  const payload = {};
  for (const [key, value] of Object.entries(form)) {
    if (initial && value === initial[key]) continue;
    if (key === "filingDate" && !value) continue;
    payload[key] = key === "periodStart" || key === "periodEnd" ? `${value.slice(5, 7)}-${value.slice(0, 4)}` : value;
  }
  return payload;
}

// Use scaled integers so the preview preserves the API's decimal-string precision.
export function payablePreview(input, output) {
  const valid = new RegExp(`^${decimalPattern}$`);
  if (!valid.test(input) || !valid.test(output)) return "—";
  const scale = Math.max(2, input.split(".")[1]?.length || 0, output.split(".")[1]?.length || 0);
  const scaled = (value) => {
    const [whole, fraction = ""] = value.replace(/^-/, "").split(".");
    return BigInt(whole + fraction.padEnd(scale, "0")) * (value.startsWith("-") ? -1n : 1n);
  };
  const result = scaled(input) - scaled(output);
  const digits = (result < 0n ? -result : result).toString().padStart(scale + 1, "0");
  return `${result < 0n ? "-" : ""}${digits.slice(0, -scale).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${digits.slice(-scale)}`;
}
