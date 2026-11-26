// Locale + currency formatting helpers, default = USD / en-US
// callers pass per-tenant overrides where available.

export interface Locale {
  locale: string;
  currency: string;
}

export const DEFAULT_LOCALE: Locale = { locale: "en-US", currency: "USD" };

export function formatCurrency(
  amount: number,
  locale: Locale = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale.locale, {
    style: "currency",
    currency: locale.currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(d: Date, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(locale.locale, { dateStyle: "medium" }).format(
    d
  );
}

export function monthName(
  month: number,
  locale: Locale = DEFAULT_LOCALE
): string {
  // month is 1-12.
  const d = new Date(2000, month - 1, 1);
  return new Intl.DateTimeFormat(locale.locale, { month: "long" }).format(d);
}

// Payment methods as stored (fee payments, salary records) -> the words a
// receipt or payslip prints. Unknown values fall back to "snake_case" -> "Snake case".
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  online: "Online",
  cheque: "Cheque",
  other: "Other",
};

export function paymentMethodLabel(method: string): string {
  const known = PAYMENT_METHOD_LABELS[method];
  if (known) return known;
  const words = method.replaceAll("_", " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "—";
}
