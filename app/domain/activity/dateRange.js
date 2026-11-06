import { createServiceError } from "../../errors/ServiceError.js";

/** Vérifie aussi la date réelle : Date peut normaliser un jour impossible vers le mois suivant. */
export function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Les bornes ISO normalisées se comparent dans leur ordre chronologique. */
export function validateActivityRange({ startWeek, endWeek }) {
  if (!isIsoDate(startWeek) || !isIsoDate(endWeek) || startWeek > endWeek) {
    throw createServiceError("Invalid activity date range.", {
      status: 400,
      code: "VALIDATION_ERROR",
    });
  }
}
