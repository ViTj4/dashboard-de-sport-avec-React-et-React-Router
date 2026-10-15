import test from "node:test";
import assert from "node:assert/strict";
import { createAuthSession, getAuthSession, destroyAuthSession } from "../app/services/session.server.js";

test("sessions use signed HttpOnly cookies and reject tampering", async () => {
  const response = await createAuthSession({ token: "private-test-token", userId: "user123" });
  assert.equal(response.headers.get("Location"), "/dashboard");
  const setCookie = response.headers.get("Set-Cookie");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Lax/i);
  assert.match(setCookie, /Max-Age=86400/i);
  const cookie = setCookie.split(";")[0];
  const request = new Request("http://localhost:4000/dashboard", { headers: { Cookie: cookie } });
  assert.deepEqual(await getAuthSession(request), { token: "private-test-token", userId: "user123" });
  const tampered = new Request(request.url, { headers: { Cookie: cookie + "tampered" } });
  assert.equal(await getAuthSession(tampered), null);
  assert.equal(await getAuthSession(new Request(request.url)), null);
  const logout = await destroyAuthSession(request);
  assert.equal(logout.headers.get("Location"), "/");
  assert.match(logout.headers.get("Set-Cookie"), /Expires=Thu, 01 Jan 1970/i);
});
