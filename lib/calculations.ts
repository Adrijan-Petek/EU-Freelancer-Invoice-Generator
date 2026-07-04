import { InvoiceDraft, ServiceItem } from "./types";
import { determineVatScenario } from "./vat";

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calcSubtotal(items: ServiceItem[]): number {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number.isFinite(item.quantity) ? item.quantity : 0;
    const unit = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
    return sum + qty * unit;
  }, 0);

  return roundMoney(subtotal);
}

export function enrichInvoiceDraft(draft: Omit<InvoiceDraft, "vatResult" | "subtotal" | "vatAmount" | "total">): InvoiceDraft {
  const subtotal = calcSubtotal(draft.serviceItems);
  const vatResult = determineVatScenario(draft.freelancer.country, draft.client.country, draft.userVatRate);
  const vatAmount = roundMoney(subtotal * (vatResult.vatRateApplied / 100));
  const total = roundMoney(subtotal + vatAmount);

  return {
    ...draft,
    vatResult,
    subtotal,
    vatAmount,
    total
  };
}
