export const complianceKeys = {
  all: ["compliance-clients"],
  list: (added, search) => [...complianceKeys.all, { added, search }],
};
