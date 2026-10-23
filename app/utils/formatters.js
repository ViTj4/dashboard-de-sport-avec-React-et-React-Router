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

export function getDurationParts(totalMinutes) {
  const minutes = Math.round(totalMinutes);
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}

export function formatHeight(centimeters) {
  const rounded = Math.round(centimeters);
  return `${Math.floor(rounded / 100)}m${String(rounded % 100).padStart(2, "0")}`;
}
