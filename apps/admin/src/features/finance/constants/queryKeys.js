// Keep the existing cache roots: invalidation relies on these exact prefixes.
export const financeKeys = {
  all: ["profit-loss"],
  revenueRoot: ["profit-loss","revenue-inflow"],
  profitLoss: (filters) => [...financeKeys.all, filters],
  revenueInflows: (filters) => [...financeKeys.revenueRoot, filters],
};
