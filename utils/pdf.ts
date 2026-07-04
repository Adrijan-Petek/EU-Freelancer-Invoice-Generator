import { jsPDF } from "jspdf";
import dayjs from "dayjs";
import { InvoiceRecord } from "../lib/types";

export function downloadInvoicePdf(invoice: InvoiceRecord): void {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 14, 30);
  doc.text(`Issue Date: ${dayjs(invoice.issueDate).format("YYYY-MM-DD")}`, 14, 36);
  doc.text(`Due Date: ${dayjs(invoice.dueDate).format("YYYY-MM-DD")}`, 14, 42);

  doc.text("Freelancer:", 14, 52);
  doc.text(invoice.freelancer.name || "", 14, 58);
  doc.text(invoice.freelancer.address || "", 14, 64);
  doc.text(`${invoice.freelancer.country} ${invoice.freelancer.vatId || ""}`.trim(), 14, 70);

  doc.text("Client:", 110, 52);
  doc.text(invoice.client.name || "", 110, 58);
  doc.text(invoice.client.address || "", 110, 64);
  doc.text(`${invoice.client.country} ${invoice.client.vatId || ""}`.trim(), 110, 70);

  doc.setFontSize(10);
  let y = 84;
  doc.text("Description", 14, y);
  doc.text("Qty", 110, y);
  doc.text("Unit", 130, y);
  doc.text("Line", 165, y);

  y += 6;
  invoice.serviceItems.forEach((item) => {
    const line = item.quantity * item.unitPrice;
    doc.text(item.description.slice(0, 55), 14, y);
    doc.text(String(item.quantity), 110, y);
    doc.text(item.unitPrice.toFixed(2), 130, y);
    doc.text(line.toFixed(2), 165, y, { align: "right" });
    y += 6;
  });

  y += 8;
  doc.text(`Subtotal: ${invoice.currency} ${invoice.subtotal.toFixed(2)}`, 120, y);
  y += 6;
  doc.text(`VAT: ${invoice.currency} ${invoice.vatAmount.toFixed(2)}`, 120, y);
  y += 6;
  doc.setFontSize(12);
  doc.text(`Total: ${invoice.currency} ${invoice.total.toFixed(2)}`, 120, y);

  y += 10;
  doc.setFontSize(10);
  doc.text(invoice.vatResult.note, 14, y, { maxWidth: 180 });

  doc.save(`${invoice.invoiceNumber}.pdf`);
}
