const EU_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE"
]);

export function normalizeCountryCode(code: string): string {
  return code.trim().toUpperCase();
}

export function isEuCountry(code: string): boolean {
  return EU_COUNTRIES.has(normalizeCountryCode(code));
}

export function getCountryOptions(): { code: string; name: string }[] {
  return [
    { code: "AT", name: "Austria" },
    { code: "BE", name: "Belgium" },
    { code: "BG", name: "Bulgaria" },
    { code: "HR", name: "Croatia" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czechia" },
    { code: "DK", name: "Denmark" },
    { code: "EE", name: "Estonia" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "GR", name: "Greece" },
    { code: "HU", name: "Hungary" },
    { code: "IE", name: "Ireland" },
    { code: "IT", name: "Italy" },
    { code: "LV", name: "Latvia" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MT", name: "Malta" },
    { code: "NL", name: "Netherlands" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "RO", name: "Romania" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "ES", name: "Spain" },
    { code: "SE", name: "Sweden" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "CH", name: "Switzerland" },
    { code: "NO", name: "Norway" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" }
  ];
}
