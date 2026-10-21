export const invoiceKeys = {
  all: ["invoices"],
  list: (params) => ["invoices", "list", params],
  detail: (id) => ["invoices", "detail", id],
};
