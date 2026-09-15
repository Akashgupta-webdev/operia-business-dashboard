// Keep the existing cache roots: invalidation relies on these exact prefixes.
export const dashboardKeys = {
  all: ["client-dashboard-kpi"],
  kpi: (filters) => [...dashboardKeys.all, filters],
};
