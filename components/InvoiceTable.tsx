import dayjs from "dayjs";
import { InvoiceRecord } from "../lib/types";

type InvoiceTableProps = {
  invoices: InvoiceRecord[];
  onEdit: (invoice: InvoiceRecord) => void;
  onDuplicate: (invoice: InvoiceRecord) => void;
  onDelete: (id: number) => void;
  onPdf: (invoice: InvoiceRecord) => void;
  labels: {
    invoiceHistory: string;
    duplicate: string;
    downloadPdf: string;
  };
};

export function InvoiceTable({
  invoices,
  onEdit,
  onDuplicate,
  onDelete,
  onPdf,
  labels
}: InvoiceTableProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{labels.invoiceHistory}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300">
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">{invoice.invoiceNumber}</td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{invoice.client.name}</td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{dayjs(invoice.issueDate).format("YYYY-MM-DD")}</td>
                <td className="px-3 py-3 text-slate-700 capitalize dark:text-slate-200">{invoice.status}</td>
                <td className="px-3 py-3 text-slate-900 dark:text-slate-100">
                  {invoice.currency} {invoice.total.toFixed(2)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      onClick={() => onEdit(invoice)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      onClick={() => onDuplicate(invoice)}
                    >
                      {labels.duplicate}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      onClick={() => onPdf(invoice)}
                    >
                      {labels.downloadPdf}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 dark:border-red-700 dark:text-red-300"
                      onClick={() => onDelete(invoice.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500 dark:text-slate-400">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
