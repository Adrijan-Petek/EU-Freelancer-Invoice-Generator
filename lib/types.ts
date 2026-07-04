export type Language = "en" | "de" | "si";

export type PartyInfo = {
  name: string;
  address: string;
  country: string;
  vatId?: string;
  email?: string;
};

export type ServiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type VatScenario = "same-country" | "reverse-charge" | "outside-eu";

export type VatResult = {
  scenario: VatScenario;
  vatRateApplied: number;
  note: string;
};

export type InvoiceDraft = {
  id?: number;
  invoiceNumber?: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  language: Language;
  freelancer: PartyInfo;
  client: PartyInfo;
  serviceItems: ServiceItem[];
  userVatRate: number;
  vatResult: VatResult;
  subtotal: number;
  vatAmount: number;
  total: number;
  status: "draft" | "sent" | "paid";
  notes?: string;
};

export type InvoiceRecord = InvoiceDraft & {
  id: number;
  createdAt: string;
  updatedAt: string;
};
