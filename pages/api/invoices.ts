import { NextApiRequest, NextApiResponse } from "next";
import {
  createInvoice,
  deleteInvoice,
  generateInvoiceNumber,
  listInvoices,
  updateInvoice
} from "../../lib/db";
import { enrichInvoiceDraft } from "../../lib/calculations";
import { InvoiceDraft } from "../../lib/types";

type ApiResponse = {
  data?: unknown;
  error?: string;
};

function normalizePayload(body: any, fallbackInvoiceNumber?: string): InvoiceDraft {
  const safeBody = body ?? {};
  const enriched = enrichInvoiceDraft({
    invoiceNumber: safeBody.invoiceNumber || fallbackInvoiceNumber || generateInvoiceNumber(),
    issueDate: safeBody.issueDate,
    dueDate: safeBody.dueDate,
    currency: safeBody.currency || "EUR",
    language: safeBody.language || "en",
    freelancer: safeBody.freelancer,
    client: safeBody.client,
    serviceItems: safeBody.serviceItems || [],
    userVatRate: Number(safeBody.userVatRate || 0),
    status: safeBody.status || "draft",
    notes: safeBody.notes || ""
  });

  return enriched;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>): void {
  try {
    if (req.method === "GET") {
      const invoices = listInvoices();
      res.status(200).json({ data: invoices });
      return;
    }

    if (req.method === "POST") {
      const invoiceNumber = req.body?.invoiceNumber || generateInvoiceNumber();
      const payload = normalizePayload(req.body, invoiceNumber);
      const created = createInvoice(payload);
      res.status(201).json({ data: created });
      return;
    }

    if (req.method === "PUT") {
      const id = Number(req.query.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: "A valid invoice id is required." });
        return;
      }

      const payload = normalizePayload(req.body);
      const updated = updateInvoice(id, payload);
      if (!updated) {
        res.status(404).json({ error: "Invoice not found." });
        return;
      }

      res.status(200).json({ data: updated });
      return;
    }

    if (req.method === "DELETE") {
      const id = Number(req.query.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: "A valid invoice id is required." });
        return;
      }

      const removed = deleteInvoice(id);
      if (!removed) {
        res.status(404).json({ error: "Invoice not found." });
        return;
      }

      res.status(200).json({ data: { success: true } });
      return;
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
