export function generateClientPortalPassword(clientName = "") {
  const name = clientName.trim().split(/\s+/)[0] || "client";
  // Leave room for @ and five digits within the password's 72-byte limit.
  const encoder = new TextEncoder();
  let prefix = "";
  for (const character of name) {
    if (encoder.encode(prefix + character).length > 66) break;
    prefix += character;
  }
  prefix = prefix.padEnd(3, "x");
  const random = new Uint32Array(1);
  const range = 90000;
  const limit = Math.floor(2 ** 32 / range) * range;
  do {
    crypto.getRandomValues(random);
  } while (random[0] >= limit);
  return `${prefix}@${10000 + (random[0] % range)}`;
}
