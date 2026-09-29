import { Link } from "react-router-dom";
import { useVatAccess } from "@/features/vat/hooks/useVat";
export default function TaxCompliancePage() {
  const access = useVatAccess();
  return <div className="space-y-4 p-6"><h1 className="text-section-heading font-bold">Tax and compliance</h1>{access.allowed && <Link to="/vat-filings" className="text-primary underline">Manage VAT filings</Link>}</div>;
}
