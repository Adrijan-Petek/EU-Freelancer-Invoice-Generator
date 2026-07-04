import { isEuCountry, normalizeCountryCode } from "./eu";
import { VatResult } from "./types";

export function determineVatScenario(
  freelancerCountry: string,
  clientCountry: string,
  standardVatRate: number
): VatResult {
  const freelancer = normalizeCountryCode(freelancerCountry);
  const client = normalizeCountryCode(clientCountry);

  if (freelancer && client && freelancer === client && isEuCountry(freelancer)) {
    return {
      scenario: "same-country",
      vatRateApplied: standardVatRate,
      note: "Domestic EU invoice: standard VAT applies."
    };
  }

  if (isEuCountry(freelancer) && isEuCountry(client) && freelancer !== client) {
    return {
      scenario: "reverse-charge",
      vatRateApplied: 0,
      note: "Reverse charge: VAT to be accounted for by the recipient (Article 196 VAT Directive)."
    };
  }

  return {
    scenario: "outside-eu",
    vatRateApplied: 0,
    note: "Export of services outside EU: VAT 0% applies."
  };
}
