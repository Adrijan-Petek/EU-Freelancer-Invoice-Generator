import { Language } from "./types";

export type CopyKey =
  | "title"
  | "subtitle"
  | "newInvoice"
  | "saveInvoice"
  | "updateInvoice"
  | "duplicate"
  | "invoiceHistory"
  | "earnings"
  | "totalInvoiced"
  | "paidInvoices"
  | "draftInvoices"
  | "client"
  | "freelancer"
  | "services"
  | "downloadPdf"
  | "exportCsv"
  | "reverseCharge"
  | "outsideEu"
  | "domesticVat";

const copy: Record<Language, Record<CopyKey, string>> = {
  en: {
    title: "EU Freelancer Invoice Generator",
    subtitle: "Fast invoices with VAT logic built for EU freelancers.",
    newInvoice: "New invoice",
    saveInvoice: "Save invoice",
    updateInvoice: "Update invoice",
    duplicate: "Duplicate",
    invoiceHistory: "Invoice history",
    earnings: "Earnings overview",
    totalInvoiced: "Total invoiced",
    paidInvoices: "Paid invoices",
    draftInvoices: "Draft invoices",
    client: "Client",
    freelancer: "Freelancer",
    services: "Services",
    downloadPdf: "PDF",
    exportCsv: "Export CSV",
    reverseCharge: "Reverse charge",
    outsideEu: "Outside EU",
    domesticVat: "Domestic VAT"
  },
  de: {
    title: "EU-Rechnungsgenerator für Freelancer",
    subtitle: "Schnelle Rechnungen mit EU-Umsatzsteuerlogik.",
    newInvoice: "Neue Rechnung",
    saveInvoice: "Rechnung speichern",
    updateInvoice: "Rechnung aktualisieren",
    duplicate: "Duplizieren",
    invoiceHistory: "Rechnungsverlauf",
    earnings: "Einnahmenübersicht",
    totalInvoiced: "Gesamt abgerechnet",
    paidInvoices: "Bezahlte Rechnungen",
    draftInvoices: "Entwurfsrechnungen",
    client: "Kunde",
    freelancer: "Freelancer",
    services: "Leistungen",
    downloadPdf: "PDF",
    exportCsv: "CSV exportieren",
    reverseCharge: "Reverse Charge",
    outsideEu: "Außerhalb der EU",
    domesticVat: "Inlands-USt"
  },
  si: {
    title: "EU generator racunov za freelancerje",
    subtitle: "Hitri racuni s pravilno EU DDV logiko.",
    newInvoice: "Nov racun",
    saveInvoice: "Shrani racun",
    updateInvoice: "Posodobi racun",
    duplicate: "Podvoji",
    invoiceHistory: "Zgodovina racunov",
    earnings: "Pregled prihodkov",
    totalInvoiced: "Skupaj izstavljeno",
    paidInvoices: "Placani racuni",
    draftInvoices: "Osnutki",
    client: "Stranka",
    freelancer: "Freelancer",
    services: "Storitve",
    downloadPdf: "PDF",
    exportCsv: "Izvozi CSV",
    reverseCharge: "Obrnjena davcna obveznost",
    outsideEu: "Izven EU",
    domesticVat: "Domaci DDV"
  }
};

export function t(language: Language, key: CopyKey): string {
  return copy[language][key];
}
