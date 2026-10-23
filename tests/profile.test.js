import test from "node:test";
import assert from "node:assert/strict";
import { buildProfileStatistics, getProfilePeriod } from "../app/domain/profile/statistics.js";
import { createProfileService } from "../app/services/profile.server.js";
import { mapActivitySessions } from "../app/mappers/activityMapper.js";
import { mapUserInfo } from "../app/mappers/userMapper.js";
import { formatHeight, getDurationParts } from "../app/utils/formatters.js";

const user = {
  createdAt: "2024-02-28",
  statistics: { totalDistance: 42.5, totalDuration: 1635, totalSessions: 5 },
};

test("profile statistics count calendar rest days once and keep the API totals", () => {
  const sessions = [
    { date: "2024-02-27", caloriesBurned: 999 },
    { date: "2024-02-28", caloriesBurned: 100 },
    { date: "2024-02-28", caloriesBurned: 200 },
    { date: "2024-03-02", caloriesBurned: 50 },
    { date: "2024-03-03", caloriesBurned: 999 },
  ];
  const before = structuredClone(sessions);
  const period = getProfilePeriod(user.createdAt, "2024-03-02");
  assert.deepEqual(buildProfileStatistics(user, sessions, period), {
    ...user.statistics, caloriesBurned: 350, restDays: 2,
  });
  assert.deepEqual(sessions, before);
  assert.equal(buildProfileStatistics(user, [], getProfilePeriod("2026-03-28", "2026-03-30")).restDays, 3);
  for (const invalid of [undefined, "2024-02-30", "2027-01-01"]) {
    assert.throws(() => getProfilePeriod(invalid, "2026-10-23"), { code: "INVALID_RESPONSE" });
  }
});

test("empty activity history yields zero calories and missing calorie measurements remain unavailable", () => {
  const period = getProfilePeriod("2026-10-23", "2026-10-23");
  assert.deepEqual(buildProfileStatistics(user, [], period), { ...user.statistics, caloriesBurned: 0, restDays: 1 });
  for (const caloriesBurned of [null, undefined]) {
    const statistics = buildProfileStatistics(user, [{ date: period.start, caloriesBurned }], period);
    assert.equal(statistics.caloriesBurned, null);
    assert.equal(statistics.restDays, 0);
  }
});

test("profile service bounds activity requests to membership dates and forwards cancellation and authentication errors", async () => {
  const signal = new AbortController().signal;
  const calls = [];
  const service = createProfileService({
    async getUserInfo(token, options) { calls.push({ token, ...options }); return user; },
    async getUserActivity(token, options) { calls.push({ token, ...options }); return []; },
  });
  const result = await service.getProfile("private-token", { signal, today: "2024-03-02" });
  assert.deepEqual(calls, [
    { token: "private-token", signal },
    { token: "private-token", signal, startWeek: "2024-02-28", endWeek: "2024-03-02" },
  ]);
  assert.equal(result.statistics.restDays, 4);
  assert.equal(JSON.stringify(result).includes("private-token"), false);
  const failure = Object.assign(new Error("Expired"), { status: 403 });
  const failedService = createProfileService({
    getUserInfo: async () => user,
    getUserActivity: async () => { throw failure; },
  });
  await assert.rejects(failedService.getProfile("expired", { today: "2024-03-02" }), (error) => error === failure);
});

test("profile mapping preserves optional gender and distinguishes absent calories from invalid data", () => {
  const dto = { profile: { firstName: "Sophie", lastName: "Martin" }, statistics: user.statistics };
  assert.equal(mapUserInfo(dto).gender, null);
  assert.equal(mapUserInfo({ ...dto, profile: { ...dto.profile, gender: " Femme " } }).gender, "Femme");
  const activity = { date: "2026-10-23", distance: 5, duration: 30, heartRate: { min: 120, average: 150, max: 180 } };
  assert.equal(mapActivitySessions([activity])[0].caloriesBurned, null);
  for (const caloriesBurned of [-1, "100", Number.NaN]) {
    assert.throws(() => mapActivitySessions([{ ...activity, caloriesBurned }]), { code: "INVALID_RESPONSE" });
  }
});

test("profile display formats durations and heights without losing minute or centimeter remainders", () => {
  assert.deepEqual(getDurationParts(1635), { hours: 27, minutes: 15 });
  assert.deepEqual(getDurationParts(60), { hours: 1, minutes: 0 });
  assert.deepEqual(getDurationParts(59.9), { hours: 1, minutes: 0 });
  assert.equal(formatHeight(168), "1m68");
  assert.equal(formatHeight(205), "2m05");
});
