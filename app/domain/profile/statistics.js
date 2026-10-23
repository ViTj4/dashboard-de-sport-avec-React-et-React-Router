import { isIsoDate } from "../activity/dateRange.js";
import { createServiceError } from "../../errors/ServiceError.js";
import { getToday } from "../../utils/dates.js";

export function getProfilePeriod(createdAt, today = getToday()) {
  if (!isIsoDate(createdAt) || !isIsoDate(today) || createdAt > today) {
    throw createServiceError("Invalid membership date.", { code: "INVALID_RESPONSE" });
  }
  return { start: createdAt, end: today };
}

export function buildProfileStatistics(user, sessions, period) {
  const activities = sessions.filter((session) => session.date >= period.start && session.date <= period.end);
  const activeDays = new Set(activities.map((session) => session.date)).size;
  const calendarDays = Math.round((Date.parse(period.end) - Date.parse(period.start)) / 86400000) + 1;
  const hasAllCalories = activities.every((session) => Number.isFinite(session.caloriesBurned));

  return {
    ...user.statistics,
    caloriesBurned: hasAllCalories ? activities.reduce((sum, session) => sum + session.caloriesBurned, 0) : null,
    restDays: calendarDays - activeDays,
  };
}
