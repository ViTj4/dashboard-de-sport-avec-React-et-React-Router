import { isIsoDate } from "../domain/activity/dateRange.js";
import { createServiceError } from "../errors/ServiceError.js";

export function mapActivitySessions(data) {
  if (!Array.isArray(data)) {
    throw createServiceError("Invalid activity response.", { code: "INVALID_RESPONSE" });
  }

  return data.map((session) => {
    const heartRate = session?.heartRate;
    if (!isIsoDate(session?.date) ||
        !Number.isFinite(session.distance) || session.distance < 0 ||
        !Number.isFinite(session.duration) || session.duration < 0 ||
        (session.caloriesBurned != null && (!Number.isFinite(session.caloriesBurned) || session.caloriesBurned < 0)) ||
        ![heartRate?.min, heartRate?.max, heartRate?.average].every((value) => Number.isFinite(value) && value > 0) ||
        heartRate.min > heartRate.average || heartRate.average > heartRate.max) {
      throw createServiceError("Invalid activity session.", { code: "INVALID_RESPONSE" });
    }

    return {
      date: session.date,
      distance: session.distance,
      duration: session.duration,
      heartRate: { min: heartRate.min, max: heartRate.max, average: heartRate.average },
      caloriesBurned: session.caloriesBurned ?? null,
    };
  }).toSorted((first, second) => first.date.localeCompare(second.date));
}
