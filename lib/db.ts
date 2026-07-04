import fs from "fs";
import path from "path";
import { InvoiceDraft, InvoiceRecord } from "./types";

type DbShape = {
  invoices: InvoiceRecord[];
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "invoices.json");

function ensureDb(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const initial: DbShape = { invoices: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readDb(): DbShape {
  ensureDb();
  const raw = fs.readFileSync(dbPath, "utf8");
  const parsed = JSON.parse(raw) as DbShape;
  return {
    invoices: Array.isArray(parsed.invoices) ? parsed.invoices : []
  };
}

function writeDb(db: DbShape): void {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function compareDateDesc(a: InvoiceRecord, b: InvoiceRecord): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function listInvoices(): InvoiceRecord[] {
  return readDb().invoices.sort(compareDateDesc);
}

export function getInvoiceById(id: number): InvoiceRecord | null {
  const found = readDb().invoices.find((invoice) => invoice.id === id);
  return found ?? null;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const invoices = readDb().invoices;

  const last = invoices
    .filter((invoice) => (invoice.invoiceNumber ?? "").startsWith(prefix))
    .map((invoice) => Number((invoice.invoiceNumber ?? "").replace(prefix, "")))
    .filter((num) => Number.isFinite(num))
    .sort((a, b) => b - a)[0];

  const next = (last ?? 0) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

export function createInvoice(payload: InvoiceDraft): InvoiceRecord {
  const db = readDb();
  const nextId = db.invoices.reduce((max, current) => Math.max(max, current.id), 0) + 1;
  const now = new Date().toISOString();

  const record: InvoiceRecord = {
    ...payload,
    id: nextId,
    createdAt: now,
    updatedAt: now
  };

  db.invoices.push(record);
  writeDb(db);

  return record;
}

export function updateInvoice(id: number, payload: InvoiceDraft): InvoiceRecord | null {
  const db = readDb();
  const index = db.invoices.findIndex((invoice) => invoice.id === id);

  if (index === -1) {
    return null;
  }

  const current = db.invoices[index];
  const updated: InvoiceRecord = {
    ...payload,
    id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString()
  };

  db.invoices[index] = updated;
  writeDb(db);

  return updated;
}

export function deleteInvoice(id: number): boolean {
  const db = readDb();
  const originalLength = db.invoices.length;
  db.invoices = db.invoices.filter((invoice) => invoice.id !== id);

  if (db.invoices.length === originalLength) {
    return false;
  }

  writeDb(db);
  return true;
}
