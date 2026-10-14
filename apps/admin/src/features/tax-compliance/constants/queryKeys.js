export const complianceKeys = {
  all: ["compliance-clients"],
  detail: (id) => [...complianceKeys.all, "detail", id],
  filings: (id, type, page, limit) => [...complianceKeys.detail(id), "filings", type, { page, limit }],
  list: (added, search) => [...complianceKeys.all, { added, search }],
};
