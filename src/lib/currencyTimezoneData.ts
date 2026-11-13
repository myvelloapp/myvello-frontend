/**
 * Comprehensive World Currencies & Timezone Mapping Data
 * Supports 160+ world currencies, ISO 4217, and 400+ IANA Timezones with automatic linkage.
 */

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  defaultTimezone: string;
  suggestedTimezones: string[];
}

// Curated primary world currencies with rich metadata & default regional timezone linkage
export const PRIMARY_CURRENCIES: CurrencyItem[] = [
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    country: "India",
    defaultTimezone: "Asia/Kolkata",
    suggestedTimezones: ["Asia/Kolkata"],
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    flag: "🇦🇪",
    country: "United Arab Emirates",
    defaultTimezone: "Asia/Dubai",
    suggestedTimezones: ["Asia/Dubai"],
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    country: "United States",
    defaultTimezone: "America/New_York",
    suggestedTimezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
    ],
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    country: "European Union",
    defaultTimezone: "Europe/Paris",
    suggestedTimezones: [
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Rome",
      "Europe/Madrid",
      "Europe/Amsterdam",
    ],
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    country: "United Kingdom",
    defaultTimezone: "Europe/London",
    suggestedTimezones: ["Europe/London"],
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼",
    flag: "🇸🇦",
    country: "Saudi Arabia",
    defaultTimezone: "Asia/Riyadh",
    suggestedTimezones: ["Asia/Riyadh"],
  },
  {
    code: "QAR",
    name: "Qatari Riyal",
    symbol: "﷼",
    flag: "🇶🇦",
    country: "Qatar",
    defaultTimezone: "Asia/Qatar",
    suggestedTimezones: ["Asia/Qatar"],
  },
  {
    code: "KWD",
    name: "Kuwaiti Dinar",
    symbol: "KD",
    flag: "🇰🇼",
    country: "Kuwait",
    defaultTimezone: "Asia/Kuwait",
    suggestedTimezones: ["Asia/Kuwait"],
  },
  {
    code: "BHD",
    name: "Bahraini Dinar",
    symbol: "BD",
    flag: "🇧🇭",
    country: "Bahrain",
    defaultTimezone: "Asia/Bahrain",
    suggestedTimezones: ["Asia/Bahrain"],
  },
  {
    code: "OMR",
    name: "Omani Rial",
    symbol: "RO",
    flag: "🇴🇲",
    country: "Oman",
    defaultTimezone: "Asia/Muscat",
    suggestedTimezones: ["Asia/Muscat"],
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "$",
    flag: "🇨🇦",
    country: "Canada",
    defaultTimezone: "America/Toronto",
    suggestedTimezones: ["America/Toronto", "America/Vancouver", "America/Edmonton"],
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "$",
    flag: "🇦🇺",
    country: "Australia",
    defaultTimezone: "Australia/Sydney",
    suggestedTimezones: [
      "Australia/Sydney",
      "Australia/Melbourne",
      "Australia/Brisbane",
      "Australia/Perth",
    ],
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    country: "Singapore",
    defaultTimezone: "Asia/Singapore",
    suggestedTimezones: ["Asia/Singapore"],
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
    flag: "🇲🇾",
    country: "Malaysia",
    defaultTimezone: "Asia/Kuala_Lumpur",
    suggestedTimezones: ["Asia/Kuala_Lumpur"],
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    country: "Japan",
    defaultTimezone: "Asia/Tokyo",
    suggestedTimezones: ["Asia/Tokyo"],
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    country: "China",
    defaultTimezone: "Asia/Shanghai",
    suggestedTimezones: ["Asia/Shanghai"],
  },
  {
    code: "HKD",
    name: "Hong Kong Dollar",
    symbol: "HK$",
    flag: "🇭🇰",
    country: "Hong Kong",
    defaultTimezone: "Asia/Hong_Kong",
    suggestedTimezones: ["Asia/Hong_Kong"],
  },
  {
    code: "KRW",
    name: "South Korean Won",
    symbol: "₩",
    flag: "🇰🇷",
    country: "South Korea",
    defaultTimezone: "Asia/Seoul",
    suggestedTimezones: ["Asia/Seoul"],
  },
  {
    code: "THB",
    name: "Thai Baht",
    symbol: "฿",
    flag: "🇹🇭",
    country: "Thailand",
    defaultTimezone: "Asia/Bangkok",
    suggestedTimezones: ["Asia/Bangkok"],
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    flag: "🇮🇩",
    country: "Indonesia",
    defaultTimezone: "Asia/Jakarta",
    suggestedTimezones: ["Asia/Jakarta"],
  },
  {
    code: "PHP",
    name: "Philippine Peso",
    symbol: "₱",
    flag: "🇵🇭",
    country: "Philippines",
    defaultTimezone: "Asia/Manila",
    suggestedTimezones: ["Asia/Manila"],
  },
  {
    code: "VND",
    name: "Vietnamese Dong",
    symbol: "₫",
    flag: "🇻🇳",
    country: "Vietnam",
    defaultTimezone: "Asia/Ho_Chi_Minh",
    suggestedTimezones: ["Asia/Ho_Chi_Minh"],
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "₨",
    flag: "🇵🇰",
    country: "Pakistan",
    defaultTimezone: "Asia/Karachi",
    suggestedTimezones: ["Asia/Karachi"],
  },
  {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    flag: "🇧🇩",
    country: "Bangladesh",
    defaultTimezone: "Asia/Dhaka",
    suggestedTimezones: ["Asia/Dhaka"],
  },
  {
    code: "LKR",
    name: "Sri Lankan Rupee",
    symbol: "Rs",
    flag: "🇱🇰",
    country: "Sri Lanka",
    defaultTimezone: "Asia/Colombo",
    suggestedTimezones: ["Asia/Colombo"],
  },
  {
    code: "NPR",
    name: "Nepalese Rupee",
    symbol: "Rs",
    flag: "🇳🇵",
    country: "Nepal",
    defaultTimezone: "Asia/Kathmandu",
    suggestedTimezones: ["Asia/Kathmandu"],
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
    symbol: "NZ$",
    flag: "🇳🇿",
    country: "New Zealand",
    defaultTimezone: "Pacific/Auckland",
    suggestedTimezones: ["Pacific/Auckland"],
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "CHF",
    flag: "🇨🇭",
    country: "Switzerland",
    defaultTimezone: "Europe/Zurich",
    suggestedTimezones: ["Europe/Zurich"],
  },
  {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    flag: "🇿🇦",
    country: "South Africa",
    defaultTimezone: "Africa/Johannesburg",
    suggestedTimezones: ["Africa/Johannesburg"],
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    flag: "🇳🇬",
    country: "Nigeria",
    defaultTimezone: "Africa/Lagos",
    suggestedTimezones: ["Africa/Lagos"],
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    flag: "🇰🇪",
    country: "Kenya",
    defaultTimezone: "Africa/Nairobi",
    suggestedTimezones: ["Africa/Nairobi"],
  },
  {
    code: "EGP",
    name: "Egyptian Pound",
    symbol: "E£",
    flag: "🇪🇬",
    country: "Egypt",
    defaultTimezone: "Africa/Cairo",
    suggestedTimezones: ["Africa/Cairo"],
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
    country: "Brazil",
    defaultTimezone: "America/Sao_Paulo",
    suggestedTimezones: ["America/Sao_Paulo"],
  },
  {
    code: "MXN",
    name: "Mexican Peso",
    symbol: "$",
    flag: "🇲🇽",
    country: "Mexico",
    defaultTimezone: "America/Mexico_City",
    suggestedTimezones: ["America/Mexico_City"],
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    symbol: "₺",
    flag: "🇹🇷",
    country: "Turkey",
    defaultTimezone: "Europe/Istanbul",
    suggestedTimezones: ["Europe/Istanbul"],
  },
  {
    code: "RUB",
    name: "Russian Ruble",
    symbol: "₽",
    flag: "🇷🇺",
    country: "Russia",
    defaultTimezone: "Europe/Moscow",
    suggestedTimezones: ["Europe/Moscow"],
  },
  {
    code: "SEK",
    name: "Swedish Krona",
    symbol: "kr",
    flag: "🇸🇪",
    country: "Sweden",
    defaultTimezone: "Europe/Stockholm",
    suggestedTimezones: ["Europe/Stockholm"],
  },
  {
    code: "NOK",
    name: "Norwegian Krone",
    symbol: "kr",
    flag: "🇳🇴",
    country: "Norway",
    defaultTimezone: "Europe/Oslo",
    suggestedTimezones: ["Europe/Oslo"],
  },
  {
    code: "DKK",
    name: "Danish Krone",
    symbol: "kr",
    flag: "🇩🇰",
    country: "Denmark",
    defaultTimezone: "Europe/Copenhagen",
    suggestedTimezones: ["Europe/Copenhagen"],
  },
  {
    code: "PLN",
    name: "Polish Zloty",
    symbol: "zł",
    flag: "🇵🇱",
    country: "Poland",
    defaultTimezone: "Europe/Warsaw",
    suggestedTimezones: ["Europe/Warsaw"],
  },
  {
    code: "ILS",
    name: "Israeli Shekel",
    symbol: "₪",
    flag: "🇮🇱",
    country: "Israel",
    defaultTimezone: "Asia/Jerusalem",
    suggestedTimezones: ["Asia/Jerusalem"],
  },
];

// Helper to get time zone offset string (e.g. "GMT+5:30")
export function getTimezoneOffset(timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "GMT";
  } catch {
    return "GMT";
  }
}

// Generate the complete list of 160+ world currencies
export function getAllWorldCurrencies(): CurrencyItem[] {
  const primaryCodes = new Set(PRIMARY_CURRENCIES.map((c) => c.code));
  const fullList: CurrencyItem[] = [...PRIMARY_CURRENCIES];

  if (typeof Intl !== "undefined" && typeof (Intl as any).supportedValuesOf === "function") {
    try {
      const allCodes: string[] = (Intl as any).supportedValuesOf("currency");
      const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });

      for (const code of allCodes) {
        if (!primaryCodes.has(code)) {
          let name = code;
          try {
            name = displayNames.of(code) || code;
          } catch {
            name = code;
          }

          let symbol = code;
          try {
            const parts = new Intl.NumberFormat("en", {
              style: "currency",
              currency: code,
            }).formatToParts(1);
            const curPart = parts.find((p) => p.type === "currency");
            if (curPart) symbol = curPart.value;
          } catch {
            symbol = code;
          }

          fullList.push({
            code,
            name,
            symbol,
            flag: "🌐",
            country: name,
            defaultTimezone: "UTC",
            suggestedTimezones: ["UTC"],
          });
        }
      }
    } catch {
      // Fallback to primary currencies
    }
  }

  return fullList;
}

let _currenciesMap: Map<string, CurrencyItem> | null = null;

// Look up detailed metadata for any currency code
export function getCurrencyInfo(code?: string | null): CurrencyItem | undefined {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();

  const primary = PRIMARY_CURRENCIES.find((c) => c.code === upper);
  if (primary) return primary;

  if (!_currenciesMap) {
    _currenciesMap = new Map();
    getAllWorldCurrencies().forEach((c) => _currenciesMap!.set(c.code, c));
  }
  return _currenciesMap.get(upper);
}

// Get the display symbol for any currency code (fallback to code if none)
export function getCurrencySymbol(code?: string | null): string {
  if (!code) return "₹";
  const info = getCurrencyInfo(code);
  return info?.symbol || code.trim().toUpperCase();
}

// Find recommended timezone for a selected currency
export function getDefaultTimezoneForCurrency(currencyCode: string): string {
  const match = PRIMARY_CURRENCIES.find(
    (c) => c.code.toUpperCase() === currencyCode.toUpperCase()
  );
  if (match) {
    return match.defaultTimezone;
  }
  return "UTC";
}

// Get suggested timezones for a selected currency
export function getSuggestedTimezonesForCurrency(currencyCode: string): string[] {
  const match = PRIMARY_CURRENCIES.find(
    (c) => c.code.toUpperCase() === currencyCode.toUpperCase()
  );
  if (match && match.suggestedTimezones.length > 0) {
    return match.suggestedTimezones;
  }
  return [];
}

// Get all IANA Timezones formatted cleanly for dropdown
export function getAllWorldTimezones(selectedCurrency?: string): Array<{
  value: string;
  label: string;
  badge?: string;
  offset: string;
}> {
  let allTz: string[] = [];

  if (typeof Intl !== "undefined" && typeof (Intl as any).supportedValuesOf === "function") {
    try {
      allTz = (Intl as any).supportedValuesOf("timeZone");
    } catch {
      allTz = [];
    }
  }

  // Inject essential modern timezones that engines might store under legacy names
  const modernAliases = [
    "Asia/Kolkata",
    "Asia/Kathmandu",
    "Asia/Ho_Chi_Minh",
    "Europe/Kyiv",
    "Asia/Yangon",
  ];
  for (const alias of modernAliases) {
    if (!allTz.includes(alias)) {
      allTz.unshift(alias);
    }
  }

  if (!allTz.includes("UTC")) {
    allTz.unshift("UTC");
  }

  const suggested = selectedCurrency
    ? getSuggestedTimezonesForCurrency(selectedCurrency)
    : [];

  const suggestedItems: Array<{ value: string; label: string; badge?: string; offset: string }> = [];
  const otherItems: Array<{ value: string; label: string; badge?: string; offset: string }> = [];
  const seen = new Set<string>();

  // Ensure suggested timezones are placed first at the top of the list
  for (const sug of suggested) {
    const offset = getTimezoneOffset(sug);
    const friendlyName = sug.replace(/_/g, " ");
    suggestedItems.push({
      value: sug,
      label: `${friendlyName} (${offset})`,
      badge: "Suggested",
      offset,
    });
    seen.add(sug.toLowerCase());
  }

  for (const tz of allTz) {
    if (seen.has(tz.toLowerCase())) continue;
    seen.add(tz.toLowerCase());

    const offset = getTimezoneOffset(tz);
    const friendlyName = tz.replace(/_/g, " ");

    otherItems.push({
      value: tz,
      label: `${friendlyName} (${offset})`,
      offset,
    });
  }

  return [...suggestedItems, ...otherItems];
}

// Format live local time in a chosen timezone
export function formatLocalTime(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "shortOffset",
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

export interface DetectedGeoInfo {
  currency: string;
  timezone: string;
  country?: string;
  source: "browser" | "ip" | "default";
}

// Comprehensive mapping from world timezones to local currency and country
const TIMEZONE_TO_CURRENCY_MAP: Record<string, { currency: string; country: string }> = {
  // India & South Asia
  "Asia/Kolkata": { currency: "INR", country: "India" },
  "Asia/Calcutta": { currency: "INR", country: "India" },
  "Asia/Karachi": { currency: "PKR", country: "Pakistan" },
  "Asia/Dhaka": { currency: "BDT", country: "Bangladesh" },
  "Asia/Colombo": { currency: "LKR", country: "Sri Lanka" },
  "Asia/Kathmandu": { currency: "NPR", country: "Nepal" },
  "Asia/Katmandu": { currency: "NPR", country: "Nepal" },

  // Middle East & GCC
  "Asia/Dubai": { currency: "AED", country: "United Arab Emirates" },
  "Asia/Riyadh": { currency: "SAR", country: "Saudi Arabia" },
  "Asia/Qatar": { currency: "QAR", country: "Qatar" },
  "Asia/Kuwait": { currency: "KWD", country: "Kuwait" },
  "Asia/Muscat": { currency: "OMR", country: "Oman" },
  "Asia/Bahrain": { currency: "BHD", country: "Bahrain" },

  // North America
  "America/New_York": { currency: "USD", country: "United States" },
  "America/Chicago": { currency: "USD", country: "United States" },
  "America/Denver": { currency: "USD", country: "United States" },
  "America/Los_Angeles": { currency: "USD", country: "United States" },
  "America/Phoenix": { currency: "USD", country: "United States" },
  "America/Detroit": { currency: "USD", country: "United States" },
  "America/Anchorage": { currency: "USD", country: "United States" },
  "America/Indiana/Indianapolis": { currency: "USD", country: "United States" },
  "Pacific/Honolulu": { currency: "USD", country: "United States" },
  "America/Toronto": { currency: "CAD", country: "Canada" },
  "America/Vancouver": { currency: "CAD", country: "Canada" },
  "America/Montreal": { currency: "CAD", country: "Canada" },
  "America/Edmonton": { currency: "CAD", country: "Canada" },
  "America/Winnipeg": { currency: "CAD", country: "Canada" },
  "America/Halifax": { currency: "CAD", country: "Canada" },

  // Europe & UK
  "Europe/London": { currency: "GBP", country: "United Kingdom" },
  "Europe/Belfast": { currency: "GBP", country: "United Kingdom" },
  "Europe/Paris": { currency: "EUR", country: "France" },
  "Europe/Berlin": { currency: "EUR", country: "Germany" },
  "Europe/Rome": { currency: "EUR", country: "Italy" },
  "Europe/Madrid": { currency: "EUR", country: "Spain" },
  "Europe/Amsterdam": { currency: "EUR", country: "Netherlands" },
  "Europe/Brussels": { currency: "EUR", country: "Belgium" },
  "Europe/Vienna": { currency: "EUR", country: "Austria" },
  "Europe/Dublin": { currency: "EUR", country: "Ireland" },
  "Europe/Lisbon": { currency: "EUR", country: "Portugal" },
  "Europe/Helsinki": { currency: "EUR", country: "Finland" },
  "Europe/Athens": { currency: "EUR", country: "Greece" },
  "Europe/Zurich": { currency: "CHF", country: "Switzerland" },
  "Europe/Stockholm": { currency: "SEK", country: "Sweden" },
  "Europe/Oslo": { currency: "NOK", country: "Norway" },
  "Europe/Copenhagen": { currency: "DKK", country: "Denmark" },
  "Europe/Warsaw": { currency: "PLN", country: "Poland" },
  "Europe/Prague": { currency: "CZK", country: "Czech Republic" },
  "Europe/Budapest": { currency: "HUF", country: "Hungary" },
  "Europe/Bucharest": { currency: "RON", country: "Romania" },
  "Europe/Istanbul": { currency: "TRY", country: "Turkey" },

  // Asia Pacific & Oceania
  "Asia/Singapore": { currency: "SGD", country: "Singapore" },
  "Asia/Tokyo": { currency: "JPY", country: "Japan" },
  "Asia/Hong_Kong": { currency: "HKD", country: "Hong Kong" },
  "Asia/Kuala_Lumpur": { currency: "MYR", country: "Malaysia" },
  "Asia/Bangkok": { currency: "THB", country: "Thailand" },
  "Asia/Jakarta": { currency: "IDR", country: "Indonesia" },
  "Asia/Makassar": { currency: "IDR", country: "Indonesia" },
  "Asia/Manila": { currency: "PHP", country: "Philippines" },
  "Asia/Seoul": { currency: "KRW", country: "South Korea" },
  "Australia/Sydney": { currency: "AUD", country: "Australia" },
  "Australia/Melbourne": { currency: "AUD", country: "Australia" },
  "Australia/Brisbane": { currency: "AUD", country: "Australia" },
  "Australia/Perth": { currency: "AUD", country: "Australia" },
  "Australia/Adelaide": { currency: "AUD", country: "Australia" },
  "Pacific/Auckland": { currency: "NZD", country: "New Zealand" },

  // Latin America & Africa
  "America/Sao_Paulo": { currency: "BRL", country: "Brazil" },
  "America/Mexico_City": { currency: "MXN", country: "Mexico" },
  "Africa/Johannesburg": { currency: "ZAR", country: "South Africa" },
  "Africa/Cairo": { currency: "EGP", country: "Egypt" },
  "Africa/Lagos": { currency: "NGN", country: "Nigeria" },
  "Africa/Nairobi": { currency: "KES", country: "Kenya" },
};

// Synchronously detect user's regional currency and timezone from browser environment
export function detectGeoPreferences(): DetectedGeoInfo {
  let browserTz = "Asia/Kolkata";
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (resolved) browserTz = resolved;
  } catch {
    // fallback
  }

  // Exact timezone lookup
  if (TIMEZONE_TO_CURRENCY_MAP[browserTz]) {
    const match = TIMEZONE_TO_CURRENCY_MAP[browserTz];
    return {
      currency: match.currency,
      timezone: browserTz,
      country: match.country,
      source: "browser",
    };
  }

  // Check prefix matches (e.g. America/* -> USD, Europe/* -> EUR)
  if (browserTz.startsWith("America/")) {
    return { currency: "USD", timezone: browserTz, country: "United States", source: "browser" };
  }
  if (browserTz.startsWith("Europe/")) {
    return { currency: "EUR", timezone: browserTz, country: "Europe", source: "browser" };
  }
  if (browserTz.startsWith("Australia/")) {
    return { currency: "AUD", timezone: browserTz, country: "Australia", source: "browser" };
  }

  // Check browser language locale
  if (typeof navigator !== "undefined" && navigator.language) {
    const lang = navigator.language.toLowerCase();
    if (lang.includes("-in")) return { currency: "INR", timezone: browserTz, country: "India", source: "browser" };
    if (lang.includes("-us")) return { currency: "USD", timezone: browserTz, country: "United States", source: "browser" };
    if (lang.includes("-gb")) return { currency: "GBP", timezone: browserTz, country: "United Kingdom", source: "browser" };
    if (lang.includes("-ae")) return { currency: "AED", timezone: browserTz, country: "United Arab Emirates", source: "browser" };
    if (lang.includes("-ca")) return { currency: "CAD", timezone: browserTz, country: "Canada", source: "browser" };
  }

  return {
    currency: "INR",
    timezone: browserTz || "Asia/Kolkata",
    country: "India",
    source: "default",
  };
}

// Asynchronously fetch IP-based geo preferences with timeout
export async function fetchGeoIpPreferences(): Promise<DetectedGeoInfo | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://freeipapi.com/api/json", { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.currency?.code && data.timeZone) {
      return {
        currency: data.currency.code,
        timezone: data.timeZone,
        country: data.countryName,
        source: "ip",
      };
    }
  } catch {
    // Graceful fallback to browser Intl timezone detection
  }
  return null;
}
