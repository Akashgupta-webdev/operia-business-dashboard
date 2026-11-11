export function discountError(value) {
  const text = String(value ?? "").trim();
  return text === "" || (/^\d+(?:\.\d{1,2})?$/.test(text) && Number(text) <= 100)
    ? "" : "Enter a discount from 0 to 100 with at most two decimal places.";
}

// Apply once to the original line sum, rounding the payable amount half-up.
export function discountedTotal(subtotal, discount = 0) {
  if (subtotal == null || discountError(discount) || !/^\d+(?:\.\d{1,2})?$/.test(String(subtotal))) return null;
  const [whole, fraction = ""] = String(subtotal).split(".");
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  const [percent, decimals = ""] = (String(discount).trim() || "0").split(".");
  const basisPoints = BigInt(percent) * 100n + BigInt(decimals.padEnd(2, "0"));
  const payable = (cents * (10000n - basisPoints) + 5000n) / 10000n;
  return `${payable / 100n}.${String(payable % 100n).padStart(2, "0")}`;
}
