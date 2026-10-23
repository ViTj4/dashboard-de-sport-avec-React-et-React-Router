import { isIsoDate } from "../activity/dateRange.js";
import { createServiceError } from "../../errors/ServiceError.js";
import { addDays, createPeriod, getToday, startOfWeek } from "../../utils/dates.js";

const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const round = (value) => Math.round(value * 10) / 10;
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

function readPeriod(searchParams, key, latestStart, weekCount) {
  const requested = searchParams.get(key);
  if (requested !== null && !isIsoDate(requested)) {
    throw createServiceError("Invalid dashboard period.", { status: 400, code: "VALIDATION_ERROR" });
  }
  const normalized = requested ? startOfWeek(requested) : latestStart;
  const start = normalized > latestStart ? latestStart : normalized;
  return { ...createPeriod(start, weekCount), latestStart };
}

export function getDashboardPeriods(searchParams, today = getToday()) {
  const currentStart = startOfWeek(today);
  return {
    today,
    distance: readPeriod(searchParams, "distanceWeek", addDays(currentStart, -21), 4),
    heart: readPeriod(searchParams, "heartWeek", currentStart, 1),
    currentWeek: createPeriod(currentStart),
  };
}

export function getActivityRequestRange(periods) {
  const selected = [periods.distance, periods.heart, periods.currentWeek];
  return {
    startWeek: selected.map((period) => period.start).toSorted()[0],
    endWeek: periods.today,
  };
}

function selectSessions(sessions, period, today) {
  return sessions.filter((session) => session.date >= period.start && session.date <= period.end && session.date <= today);
}

export function buildDashboardData(sessions, periods) {
  const distanceSessions = selectSessions(sessions, periods.distance, periods.today);
  const distanceWeeks = Array.from({ length: 4 }, (_, index) => {
    const week = createPeriod(addDays(periods.distance.start, index * 7));
    return {
      label: `S${index + 1}`,
      start: week.start,
      end: week.end,
      distance: round(selectSessions(distanceSessions, week, periods.today).reduce((sum, session) => sum + session.distance, 0)),
    };
  });
  const heartSessions = selectSessions(sessions, periods.heart, periods.today);
  const heartDays = dayLabels.map((label, index) => {
    const date = addDays(periods.heart.start, index);
    const dailySessions = heartSessions.filter((session) => session.date === date);
    return {
      label,
      date,
      min: dailySessions.length ? Math.min(...dailySessions.map((session) => session.heartRate.min)) : null,
      max: dailySessions.length ? Math.max(...dailySessions.map((session) => session.heartRate.max)) : null,
      average: dailySessions.length ? round(average(dailySessions.map((session) => session.heartRate.average))) : null,
    };
  });
  const currentSessions = selectSessions(sessions, periods.currentWeek, periods.today);

  return {
    periods,
    distance: {
      weeks: distanceWeeks,
      average: round(distanceSessions.reduce((sum, session) => sum + session.distance, 0) / 4),
      hasData: distanceSessions.length > 0,
    },
    heart: {
      days: heartDays,
      average: heartSessions.length ? Math.round(average(heartSessions.map((session) => session.heartRate.average))) : null,
      hasData: heartSessions.length > 0,
    },
    currentWeek: {
      sessions: currentSessions.length,
      distance: round(currentSessions.reduce((sum, session) => sum + session.distance, 0)),
      duration: currentSessions.reduce((sum, session) => sum + session.duration, 0),
    },
  };
}
