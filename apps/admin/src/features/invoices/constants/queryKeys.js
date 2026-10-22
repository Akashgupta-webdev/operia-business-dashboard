export const invoiceKeys = {
  all: ["invoices"],
  lists: () => ["invoices", "list"],
  list: (params) => ["invoices", "list", params],
  detail: (id) => ["invoices", "detail", id],
};
