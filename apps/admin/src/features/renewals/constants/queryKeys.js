// Keep the existing cache roots: invalidation relies on these exact prefixes.
export const renewalKeys = {
  all: ["client-renewals"],
  list: (filters) => [...renewalKeys.all, filters],
};
