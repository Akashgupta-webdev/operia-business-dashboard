// Keep the existing cache roots: invalidation relies on these exact prefixes.
export const clientKeys = {
  all: ["clients"],
  detailRoot: ["client-detail"],
  list: (filters) => [...clientKeys.all, filters],
  detail: (clientId) => [...clientKeys.detailRoot, clientId],
};
