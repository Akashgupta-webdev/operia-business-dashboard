// Keep the existing cache roots: invalidation relies on these exact prefixes.
export const companyKeys = {
  all: ["client-companies"],
  list: (filters) => [...companyKeys.all, filters],
};
