import test from "node:test";
import assert from "node:assert/strict";
import { readLoginForm } from "../app/domain/auth/credentials.js";
import { createAuthService } from "../app/services/auth.server.js";
import { mapUserInfo } from "../app/mappers/userMapper.js";
import { validateActivityRange } from "../app/domain/activity/dateRange.js";
import { assertSameOriginPost } from "../app/utils/http.server.js";
import { createServiceError, isAuthenticationError } from "../app/errors/ServiceError.js";

test("functional service errors preserve their cause and identify authentication failures", () => {
  const cause = new Error("Upstream rejected the session.");
  const error = createServiceError("Invalid session.", { status: 401, cause });
  assert.ok(error instanceof Error);
  assert.equal(error.cause, cause);
  assert.equal(isAuthenticationError(error), true);
  assert.equal(isAuthenticationError(createServiceError("Forbidden.", { status: 403 })), true);
  assert.equal(isAuthenticationError(createServiceError("Unavailable.", { status: 503 })), false);
  assert.equal(isAuthenticationError({ status: 401 }), false);
  assert.equal(isAuthenticationError(null), false);
});

test("login trims the username and preserves the password verbatim", () => {
  const form = new FormData();
  form.set("username", "  sophiemartin  ");
  form.set("password", " password123 ");
  assert.deepEqual(readLoginForm(form), {
    credentials: { username: "sophiemartin", password: " password123 " },
    errors: {},
  });
});

test("missing fields and file uploads are rejected as credentials", () => {
  const form = new FormData();
  form.set("username", "   ");
  form.set("password", new Blob(["password123"]), "password.txt");
  const { errors, credentials } = readLoginForm(form);
  assert.deepEqual(Object.keys(errors), ["username", "password"]);
  assert.deepEqual(credentials, { username: "", password: "" });
});

test("authentication refuses malformed successful API responses", async () => {
  for (const response of [null, {}, { token: "", userId: "user123" }, { token: "token" }]) {
    const service = createAuthService({ login: async () => response });
    await assert.rejects(service.login({}), { code: "INVALID_RESPONSE" });
  }
});

test("the user mapper converts distance and rejects invalid statistics", () => {
  const dto = {
    profile: { firstName: "Sophie", lastName: "Martin" },
    statistics: { totalDistance: "42.5", totalSessions: 4, totalDuration: 250 },
  };
  const user = mapUserInfo(dto);
  assert.equal(user.firstName, "Sophie");
  assert.equal(user.statistics.totalDistance, 42.5);
  assert.equal(dto.statistics.totalDistance, "42.5");
  for (const totalDistance of [null, "", "invalid", -1]) {
    assert.throws(() => mapUserInfo({ ...dto, statistics: { ...dto.statistics, totalDistance } }), {
      code: "INVALID_RESPONSE",
    });
  }
});

test("activity ranges require real ISO dates in chronological order", () => {
  assert.doesNotThrow(() => validateActivityRange({ startWeek: "2024-02-29", endWeek: "2024-02-29" }));
  for (const range of [
    { startWeek: "2025-02-29", endWeek: "2025-03-01" },
    { startWeek: "2025-01-02", endWeek: "2025-01-01" },
    { startWeek: "01/01/2025", endWeek: "2025-01-02" },
    {},
  ]) {
    assert.throws(() => validateActivityRange(range), { code: "VALIDATION_ERROR", status: 400 });
  }
});

test("session mutations reject cross-origin requests and GET requests", () => {
  assert.doesNotThrow(() => assertSameOriginPost(new Request("http://localhost:4000/", {
    method: "POST", headers: { Origin: "http://localhost:4000" },
  })));
  assert.throws(() => assertSameOriginPost(new Request("http://localhost:4000/", {
    method: "POST", headers: { Origin: "http://other-site.example" },
  })), (error) => error.status === 403);
  assert.throws(() => assertSameOriginPost(new Request("http://localhost:4000/")),
    (error) => error.status === 405);
});
