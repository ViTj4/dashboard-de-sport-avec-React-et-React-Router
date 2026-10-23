import test from "node:test";
import assert from "node:assert/strict";
import { getDashboardPeriods, getActivityRequestRange, buildDashboardData } from "../app/domain/dashboard/dashboard.js";
import { mapActivitySessions } from "../app/mappers/activityMapper.js";
import { addDays, getToday, startOfWeek } from "../app/utils/dates.js";

function session(date, distance = 5, duration = 30, heartRate = { min: 120, max: 180, average: 150 }) {
  return { date, distance, duration, heartRate };
}

test("calendar weeks remain stable across years, leap days and daylight saving time", () => {
  assert.equal(startOfWeek("2025-01-01"), "2024-12-30");
  assert.equal(startOfWeek("2025-01-05"), "2024-12-30");
  assert.equal(startOfWeek("2025-01-06"), "2025-01-06");
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2026-10-19", 7), "2026-10-26");
  assert.equal(getToday(new Date("2026-10-22T22:30:00Z")), "2026-10-23");
});

test("distance and heart periods are independent and future requests are bounded", () => {
  const selected = getDashboardPeriods(new URLSearchParams("distanceWeek=2025-01-08&heartWeek=2025-01-14"), "2026-10-23");
  assert.equal(selected.distance.start, "2025-01-06");
  assert.equal(selected.distance.end, "2025-02-02");
  assert.equal(selected.heart.start, "2025-01-13");
  assert.equal(selected.heart.end, "2025-01-19");
  const current = getDashboardPeriods(new URLSearchParams("distanceWeek=2029-01-01&heartWeek=2029-01-01"), "2026-10-23");
  assert.equal(current.distance.start, "2026-09-28");
  assert.equal(current.heart.start, "2026-10-19");
  assert.deepEqual(getActivityRequestRange(selected), { startWeek: "2025-01-06", endWeek: "2026-10-23" });
  for (const invalid of ["2025-02-30", "not-a-date", ""]) {
    assert.throws(() => getDashboardPeriods(new URLSearchParams({ heartWeek: invalid }), "2026-10-23"), {
      status: 400, code: "VALIDATION_ERROR",
    });
  }
});

test("dashboard aggregation includes boundaries, empty weeks and multiple sessions per day", () => {
  const periods = getDashboardPeriods(new URLSearchParams(), "2026-10-23");
  const sessions = [
    session("2026-09-27", 99),
    session("2026-09-28", 4),
    session("2026-10-04", 6),
    session("2026-10-19", 7, 40, { min: 120, max: 175, average: 150 }),
    session("2026-10-19", 3, 20, { min: 130, max: 185, average: 160 }),
    session("2026-10-23", 8, 50, { min: 125, max: 180, average: 155 }),
    session("2026-10-24", 999),
  ];
  const before = structuredClone(sessions);
  const data = buildDashboardData(sessions, periods);
  assert.deepEqual(data.distance.weeks.map((week) => week.distance), [10, 0, 0, 18]);
  assert.equal(data.distance.average, 7);
  assert.equal(data.heart.average, 155);
  assert.deepEqual(data.heart.days[0], { label: "Lun", date: "2026-10-19", min: 120, max: 185, average: 155 });
  assert.equal(data.heart.days[1].average, null);
  assert.equal(data.heart.days[5].average, null);
  assert.deepEqual(data.currentWeek, { sessions: 3, distance: 18, duration: 110 });
  assert.deepEqual(sessions, before);
});

test("historical chart pagination does not alter the current week summary", () => {
  const periods = getDashboardPeriods(new URLSearchParams("distanceWeek=2025-01-06&heartWeek=2025-01-13"), "2026-10-23");
  const data = buildDashboardData([session("2025-01-14", 12), session("2026-10-20", 5)], periods);
  assert.equal(data.distance.average, 3);
  assert.equal(data.heart.average, 150);
  assert.deepEqual(data.currentWeek, { sessions: 1, distance: 5, duration: 30 });
});

test("empty periods produce zero distances and absent heart rates, not fabricated BPM", () => {
  const data = buildDashboardData([], getDashboardPeriods(new URLSearchParams(), "2026-10-23"));
  assert.equal(data.distance.average, 0);
  assert.equal(data.distance.hasData, false);
  assert.equal(data.heart.average, null);
  assert.equal(data.heart.hasData, false);
  assert.ok(data.heart.days.every((day) => day.min === null && day.max === null && day.average === null));
  assert.deepEqual(data.currentWeek, { sessions: 0, distance: 0, duration: 0 });
});

test("activity mapping sorts without mutation and rejects malformed physiological data", () => {
  const source = [session("2026-10-23"), session("2026-10-19")];
  const mapped = mapActivitySessions(source);
  assert.equal(mapped[0].date, "2026-10-19");
  assert.equal(source[0].date, "2026-10-23");
  mapped[0].heartRate.average = 160;
  assert.equal(source[1].heartRate.average, 150);
  for (const invalid of [null, {}, [session("2025-02-30")], [session("2026-10-19", -1)],
    [session("2026-10-19", 5, 30, { min: 150, max: 140, average: 145 })]]) {
    assert.throws(() => mapActivitySessions(invalid), { code: "INVALID_RESPONSE" });
  }
});
