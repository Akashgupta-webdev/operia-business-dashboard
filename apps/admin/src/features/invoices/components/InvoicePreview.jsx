import { useRef, useState } from "react";
import { Download, Pencil, Printer } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@operio/ui/components/dialog";
import { useInvoice } from "../hooks/useInvoices";
import { dateLabel, description, errorMessage, referenceId } from "../utils/invoice";
import printStyles from "./invoice-preview.css?inline";
import "./invoice-preview.css";

const amount = (value) => value == null ? "—" : new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value));
const text = (value) => value || "—";
const headings = [["Item", "البند"], ["Description", "الوصف"], ["Qty", "الكمية"], ["Govt Rate", "الرسوم الحكومية"], ["Service Price", "سعر الخدمة"], ["Tax Code", "الرمز الضريبي"], ["Tax Amount", "قيمة الضريبة"], ["Grand Total", "المجموع الإجمالي"]];

export function InvoiceDocument({ invoice }) {
  const services = invoice.service || invoice.items?.map((line, index) => ({ itemDescription: description(line.item), qty: line.quantity, govtRate: line.governmentRate, servicePrice: line.servicePrice, taxCode: line.taxRate, taxAmount: line.taxAmount, grandTotal: invoice.totals?.lineTotals?.[index] })) || [];
  const total = invoice.grandTotalAmount ?? invoice.totals?.total;
  // The detail contract only distinguishes 0% and 5%; it cannot classify exempt/out-of-scope supplies.
  const taxable = services.filter((line) => Number(line.taxCode) === 5).reduce((sum, line) => sum + Number(line.servicePrice) * Number(line.qty), 0);
  return <article className="invoice-paper" aria-label={`Invoice ${invoice.invoiceNo || invoice.invoiceNumber}`}>
    <header className="invoice-letterhead"><img src="/operia-logo-removebg.png" alt="Operio logo" /><div><p lang="ar" dir="rtl">أوبيريو بيزنس ذ.م.م</p><h2>Operio Bussiness L.L.C</h2></div></header>
    <div className="invoice-border">
      <div className="invoice-information"><table className="invoice-customer"><tbody>
        <tr><th>Customer Name<br /><span lang="ar">اسم العميل</span></th><td><strong>{text(invoice.customerName || invoice.client?.name)}</strong><p>Address: {text(invoice.fullAddress)}</p><p>Mobile No: {text(invoice.contactNo || invoice.client?.mobileNumber)}</p><p>TRN: {text(invoice.trnNo || invoice.company?.vatTaxRegistrationNumber)}</p></td></tr>
        <tr><th>Date <span lang="ar">التاريخ</span></th><td>{dateLabel(invoice.issueDate || invoice.invoiceDate)}</td></tr>
        <tr><th>Client ID <span lang="ar">رقم العميل</span></th><td>{text(referenceId(invoice.clientId || invoice.client))}</td></tr>
        <tr><th>Currency <span lang="ar">العملة</span></th><td>Dirham | AED</td></tr>
      </tbody></table><aside className="invoice-bank"><h3>TAX INVOICE<br /><span lang="ar">فاتورة ضريبية</span></h3><p>TRN: 101002834974</p><p>Invoice No: {text(invoice.invoiceNo || invoice.invoiceNumber)}</p><div><p>Acc No: 29627639</p><p>SWIFT/BIC: ABDIAEADXXX</p><p>IBAN: AE170500000000029627639</p></div></aside></div>
      <table className="invoice-lines"><colgroup>{[5, 44, 5, 8, 8, 10, 10, 10].map((width, index) => <col key={index} style={{ width: `${width}%` }} />)}</colgroup><thead><tr>{headings.map(([en, ar]) => <th key={en} scope="col">{en}<br /><span lang="ar">{ar}</span></th>)}</tr></thead><tbody>
        {services.map((line, index) => <tr key={index}><td>{index + 1}</td><td>{line.itemDescription}</td><td>{line.qty}</td><td>{amount(line.govtRate)}</td><td>{amount(line.servicePrice)}</td><td>Tax {line.taxCode}%</td><td>{amount(line.taxAmount)}</td><td>{amount(line.grandTotal)}</td></tr>)}
        {Array.from({ length: Math.max(0, 3 - services.length) }, (_, index) => <tr key={`blank-${index}`} aria-hidden="true">{headings.map(([heading]) => <td key={heading}>&nbsp;</td>)}</tr>)}
      </tbody><tfoot><tr><th colSpan={6}>Sub Total <span lang="ar">المجموع الفرعي</span></th><td>{amount(invoice.grandTotalTaxAmount ?? invoice.totals?.taxAmount)}</td><td>{amount(invoice.totals?.subtotal ?? total)}</td></tr><tr><th colSpan={7}>Advance Amount <span lang="ar">المبلغ المقدم</span></th><td>{amount(invoice.advanceAmount)}</td></tr>{Number(invoice.discount) > 0 && <tr><th colSpan={7}>Discount (%)</th><td>{invoice.discount}%</td></tr>}<tr><th colSpan={7}>Total <span lang="ar">المجموع</span></th><td>{amount(total)}</td></tr></tfoot></table>
      <table className="invoice-tax"><caption>TAX Summary</caption><thead><tr>{["Exempted (EXE)", "Out Of Scope Supplies (OSCS)", "Zero Rated (Zero)", "Disbursement (DISB)", "Taxable Supplies"].map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody><tr><td>—</td><td>—</td><td>—</td><td>—</td><td>{amount(taxable)}</td></tr></tbody></table>
      {invoice.remark?.trim() && <div className="invoice-note" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}><strong>Remark: </strong>{invoice.remark}</div>}
      <div className="invoice-signature"><img src="/operio-invoice-logo.png" alt="Operio invoice stamp" /><strong>Authorized Signatory</strong></div>
      <footer className="invoice-note">Note: “This is a system generated invoice and does not require a hard copy. You are requested to print the same for your administrative handling.”</footer>
    </div>
  </article>;
}

function invoiceFilename(invoice) {
  return [invoice.trnNo || invoice.company?.vatTaxRegistrationNumber, invoice.invoiceNo || invoice.invoiceNumber]
      .filter(Boolean).join("-").replace(/[<>:"/\\|?*]/g, "-")
      .split("").filter((character) => character.charCodeAt(0) >= 32).join("") || "Invoice";
}

export default function InvoicePreview({ id, onClose, onEdit }) {
  const query = useInvoice(id);
  const paper = useRef(null);
  const [printing, setPrinting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const downloadPending = useRef(false);
  const [printError, setPrintError] = useState("");
  async function download() {
    if (downloadPending.current || !query.data || !paper.current) return;
    downloadPending.current = true;
    setDownloading(true);
    setPrintError("");
    try {
      const { default: html2pdf } = await import("html2pdf.js");
      await Promise.all(Array.from(paper.current.querySelectorAll("img"), (img) => img.decode()));
      await document.fonts.ready;
      const element = paper.current.firstElementChild.cloneNode(true);
      // Page-break measurement runs before canvas cloning, so size this copy for A4 too.
      element.style.cssText = "width:210mm;min-height:296mm;margin:0;padding-bottom:20px;display:flex;flex-direction:column";
      element.querySelector(".invoice-border").style.cssText = "flex:1;min-height:0";
      element.querySelector(".invoice-letterhead").style.flexShrink = "0";
      element.querySelector(".invoice-tax").style.marginTop = "20px";
      element.querySelector(".invoice-signature").style.cssText = "margin:auto 65px 24px auto;padding-top:32px;break-after:avoid";
      await html2pdf().set({
        filename: invoiceFilename(query.data) + ".pdf",
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css"], avoid: [".invoice-lines tr", ".invoice-signature", ".invoice-note"] },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          onclone: (doc) => {
            // Isolate invoice styles from application themes and unsupported color functions.
            doc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
            const style = doc.createElement("style");
            style.textContent = printStyles.replace("@media print", "@media all");
            doc.head.appendChild(style);
          },
        },
      }).from(element).save();
    } catch {
      setPrintError("Unable to download the invoice PDF. Please try again.");
    } finally {
      downloadPending.current = false;
      setDownloading(false);
    }
  }
  async function print() {
    setPrinting(true); setPrintError("");
    const invoice = query.data;
    const filename = invoiceFilename(invoice);
    const previousTitle = document.title;
    const frame = document.createElement("iframe");
    const cleanup = () => {
      if (document.title === filename) document.title = previousTitle;
      frame.remove();
    };
    frame.title = "Print invoice";
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;";
    document.body.appendChild(frame);
    try {
      const doc = frame.contentDocument;
      doc.open(); doc.write("<!doctype html><html><head><title>Invoice</title></head><body></body></html>"); doc.close();
      doc.title = filename;
      const style = doc.createElement("style"); style.textContent = printStyles; doc.head.appendChild(style);
      doc.body.appendChild(paper.current.firstElementChild.cloneNode(true));
      await Promise.all(Array.from(doc.images, (img) => img.decode()));
      await doc.fonts.ready;
      document.title = filename;
      frame.contentWindow.addEventListener("afterprint", cleanup, { once: true });
      frame.contentWindow.focus(); frame.contentWindow.print();
      setTimeout(cleanup, 60000);
    } catch { cleanup(); setPrintError("Unable to prepare the invoice for printing. Please retry."); }
    finally { setPrinting(false); }
  }
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="flex max-h-[90svh] max-w-5xl flex-col overflow-hidden bg-surface-primary p-0">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b p-5 pr-14"><div><DialogTitle>Invoice Preview</DialogTitle><DialogDescription>{query.data?.invoiceNumber || "Review your invoice before printing."}</DialogDescription></div><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={!query.data || query.isError} onClick={onEdit}><Pencil className="size-4" />Edit</Button><Button disabled={!query.data || query.isError || printing || downloading} onClick={print}><Printer className="size-4" />{printing ? "Preparing…" : "Print"}</Button><Button variant="outline" disabled={!query.data || query.isError || printing || downloading} onClick={download}><Download aria-hidden="true" className="size-4" />{downloading ? "Downloading..." : "Download"}</Button></div></header>
    {printError && <p role="alert" className="px-5 text-sm text-destructive">{printError}</p>}
    <div className="overflow-auto bg-surface-secondary p-3 sm:p-6">{query.isPending ? <p role="status" className="p-8 text-center">Loading invoice…</p> : query.isError ? <div role="alert" className="space-y-3 p-8 text-center"><p>{errorMessage(query.error)}</p><Button variant="outline" onClick={() => query.refetch()}>Retry</Button></div> : <div ref={paper}><InvoiceDocument invoice={query.data} /></div>}</div>
  </DialogContent></Dialog>;
}
