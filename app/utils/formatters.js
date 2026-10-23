export function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits }).format(value);
}

export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC", ...options,
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatShortDate(date) {
  return formatDate(date, { day: "2-digit", month: "long", year: undefined });
}

export function formatNumericDate(date) {
  return formatDate(date, { day: "2-digit", month: "2-digit", year: "numeric" });
}
