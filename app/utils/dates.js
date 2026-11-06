const dayInMilliseconds = 24 * 60 * 60 * 1000;

/** Utilise le jour civil français, indépendamment du fuseau horaire du serveur. */
export function getToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const getPart = (type) => parts.find((part) => part.type === type).value;
  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

/** L'arithmétique en UTC évite qu'un changement d'heure décale une date calendaire. */
export function addDays(date, count) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + count * dayInMilliseconds).toISOString().slice(0, 10);
}

/** Ramène toute date au lundi de sa semaine. */
export function startOfWeek(date) {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return addDays(date, -((day + 6) % 7));
}

/** Produit une période de semaines avec une borne de fin incluse. */
export function createPeriod(start, weekCount = 1) {
  return { start, end: addDays(start, weekCount * 7 - 1), weekCount };
}
