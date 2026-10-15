import { createServiceError } from "../../errors/ServiceError.js";

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateActivityRange({ startWeek, endWeek }) {
  if (!isIsoDate(startWeek) || !isIsoDate(endWeek) || startWeek > endWeek) {
    throw createServiceError("Invalid activity date range.", {
      status: 400,
      code: "VALIDATION_ERROR",
    });
  }
}
