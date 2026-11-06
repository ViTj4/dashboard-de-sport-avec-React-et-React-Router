import { isIsoDate } from "../activity/dateRange.js";
import { createServiceError } from "../../errors/ServiceError.js";
import { getToday } from "../../utils/dates.js";

/** Borne l'historique à l'inscription et au jour courant, tous deux inclus. */
export function getProfilePeriod(createdAt, today = getToday()) {
  if (!isIsoDate(createdAt) || !isIsoDate(today) || createdAt > today) {
    throw createServiceError("Invalid membership date.", { code: "INVALID_RESPONSE" });
  }
  return { start: createdAt, end: today };
}

/** Conserve les totaux utilisateur et complète les calories et le repos sur l'historique filtré. */
export function buildProfileStatistics(user, sessions, period) {
  const activities = sessions.filter((session) => session.date >= period.start && session.date <= period.end);
  // Plusieurs courses le même jour ne retirent qu'une journée au nombre de jours de repos.
  const activeDays = new Set(activities.map((session) => session.date)).size;
  const calendarDays = Math.round((Date.parse(period.end) - Date.parse(period.start)) / 86400000) + 1;
  // Une mesure manquante rend le total inconnu ; un historique vide reste un total connu de zéro.
  const hasAllCalories = activities.every((session) => Number.isFinite(session.caloriesBurned));

  return {
    ...user.statistics,
    caloriesBurned: hasAllCalories ? activities.reduce((sum, session) => sum + session.caloriesBurned, 0) : null,
    restDays: calendarDays - activeDays,
  };
}
