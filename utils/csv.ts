import { InvoiceRecord } from "../lib/types";

export function exportInvoicesCsv(invoices: InvoiceRecord[]): void {
  const headers = [
    "invoiceNumber",
    "issueDate",
    "clientName",
    "country",
    "subtotal",
    "vatAmount",
    "total",
    "currency",
    "status"
  ];

  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.issueDate,
    invoice.client.name,
    invoice.client.country,
    invoice.subtotal.toFixed(2),
    invoice.vatAmount.toFixed(2),
    invoice.total.toFixed(2),
    invoice.currency,
    invoice.status
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "invoices.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
