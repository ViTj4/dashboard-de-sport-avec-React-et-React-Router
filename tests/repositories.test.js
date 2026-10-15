import test from "node:test";
import assert from "node:assert/strict";
import { AxiosError, CanceledError } from "axios";
import { createApiRepository } from "../app/services/repositories/apiRepository.server.js";
import { createMockRepository } from "../app/mocks/mockRepository.server.js";

test("API requests keep each user's Bearer token isolated", async () => {
  const requests = [];
  const repository = createApiRepository({ client: {
    async request(config) {
      requests.push(config);
      return { data: { receivedToken: config.headers?.Authorization } };
    },
  } });
  const results = await Promise.all([
    repository.getUserInfo("first-user-token"),
    repository.getUserInfo("second-user-token"),
  ]);
  assert.deepEqual(results.map((result) => result.receivedToken), [
    "Bearer first-user-token", "Bearer second-user-token",
  ]);
  await repository.login({ username: "demo", password: "demo" });
  assert.equal(requests[2].headers, undefined);
  assert.equal(requests[2].url, "/api/login");
});

test("activity requests forward date parameters and cancellation signals", async () => {
  let received;
  const repository = createApiRepository({ client: {
    async request(config) { received = config; return { data: [] }; },
  } });
  const controller = new AbortController();
  await repository.getUserActivity("token", {
    startWeek: "2025-01-01", endWeek: "2025-01-31", signal: controller.signal,
  });
  assert.equal(received.url, "/api/user-activity");
  assert.deepEqual(received.params, { startWeek: "2025-01-01", endWeek: "2025-01-31" });
  assert.equal(received.signal, controller.signal);
});

test("HTTP, network and timeout errors remain distinguishable; cancellation propagates", async () => {
  for (const scenario of [
    { error: new AxiosError("unavailable", "ERR_NETWORK"), expected: { code: "NETWORK_ERROR", status: 503 } },
    { error: new AxiosError("timeout", "ECONNABORTED"), expected: { code: "TIMEOUT", status: 503 } },
    { error: new AxiosError("denied", "ERR_BAD_REQUEST", null, null, { status: 401 }), expected: { code: "HTTP_ERROR", status: 401 } },
  ]) {
    const repository = createApiRepository({ client: {
      request: async () => { throw scenario.error; },
    } });
    await assert.rejects(repository.getUserInfo("token"), scenario.expected);
  }
  const cancellation = new CanceledError();
  const repository = createApiRepository({ client: { request: async () => { throw cancellation; } } });
  await assert.rejects(repository.getUserInfo("token"), (error) => error === cancellation);
});

test("mock authentication supports all three demo accounts and rejects invalid credentials", async () => {
  const repository = createMockRepository();
  for (const [username, password, firstName] of [
    ["sophiemartin", "password123", "Sophie"],
    ["emmaleroy", "password789", "Emma"],
    ["marcdubois", "password456", "Marc"],
  ]) {
    const { token } = await repository.login({ username, password });
    assert.equal((await repository.getUserInfo(token)).profile.firstName, firstName);
  }
  await assert.rejects(repository.login({ username: "sophiemartin", password: "wrong" }), { status: 401 });
  await assert.rejects(repository.getUserInfo("unknown-token"), { status: 401 });
});

test("mock activities include range boundaries, sort dates and exclude future sessions", async () => {
  const users = [{
    id: "user123", username: "sophiemartin", profile: { firstName: "Sophie" },
    activities: [
      { date: "2026-01-03", distance: 7, duration: 40 },
      { date: "2026-01-01", distance: 2, duration: 10 },
      { date: "2026-01-04", distance: 9, duration: 50 },
    ],
  }];
  let timestamp = Date.parse("2026-01-03T12:00:00Z");
  const repository = createMockRepository({ users, now: () => timestamp });
  const { token } = await repository.login({ username: "sophiemartin", password: "password123" });
  const range = { startWeek: "2026-01-01", endWeek: "2026-01-04" };
  const sessions = await repository.getUserActivity(token, range);
  assert.deepEqual(sessions.map((session) => session.date), ["2026-01-01", "2026-01-03"]);
  sessions[0].distance = 999;
  assert.equal((await repository.getUserActivity(token, range))[0].distance, 2);
  const info = await repository.getUserInfo(token);
  assert.deepEqual(info.statistics, { totalDistance: "18.0", totalSessions: 3, totalDuration: 100 });
  info.profile.firstName = "Changed";
  assert.equal((await repository.getUserInfo(token)).profile.firstName, "Sophie");
  timestamp += 24 * 60 * 60 * 1000;
  await assert.rejects(repository.getUserInfo(token), { status: 401 });
});
