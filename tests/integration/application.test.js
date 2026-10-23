import test   ,                 { before, after } from "node:test";
import assert               from "node:assert/strict";
import { createCookie }     from "react-router";
import { env }              from "../../app/config/env.server.js";
import { startApplication } from "../helpers/startApplication.js";

let apiAppUrl;
let mockAppUrl;
let offlineAppUrl;
const applications = [];
const cookieSigner = createCookie("sportsee_session", { secrets: [env.sessionSecret] });

before(async () => {
  for (const options of [
    { dataSource: "api", apiBaseUrl: env.apiBaseUrl },
    { dataSource: "mock", apiBaseUrl: env.apiBaseUrl },
    { dataSource: "api", apiBaseUrl: "http://127.0.0.1:9" },
  ]) {
    applications.push(await startApplication({ ...options, sessionSecret: env.sessionSecret }));
  }
  [apiAppUrl, mockAppUrl, offlineAppUrl] = applications.map((application) => application.url);
});

after(async () => {
  await Promise.all(applications.map((application) => application.stop()));
});

async function createCookieWithToken(token) {
  const serialized = await cookieSigner.serialize({ token, userId: "user123", source: "api" });
  return serialized.split(";")[0];
}

function get(base, path, cookie) {
  return fetch(new URL(path, base), { redirect: "manual", headers: cookie ? { Cookie: cookie } : {} });
}

function post(base, path, fields, { cookie, origin = base } = {}) {
  return fetch(new URL(path, base), {
    method  : "POST",
    redirect: "manual",
    body    : new URLSearchParams(fields),
    headers : { Origin: origin, ...(cookie ? { Cookie: cookie } : {}) },
  });
}

for (const [mode, getBase] of [["api", () => apiAppUrl], ["mock", () => mockAppUrl]]) {
  test(`${mode}: protected route, login validation, private session and logout`, async () => {
    const base      = getBase();
    const anonymous = await get(base, "/dashboard");
    assert.equal(anonymous.status, 302);
    assert.equal(anonymous.headers.get("Location"), "/");

    const missing = await post(base, "/?index", {});
    assert.equal(missing.status, 400);
    assert.match(await missing.text(), /Saisissez votre nom/);

    const invalid = await post(base, "/?index", { username: "sophiemartin", password: "wrong" });
    assert.equal(invalid.status, 401);
    assert.match(await invalid.text(), /mot de passe incorrect/);
    assert.equal(invalid.headers.get("Set-Cookie"), null);

    const response = await post(base, "/?index", { username: "sophiemartin", password: "password123" });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("Location"), "/dashboard");
    const setCookie = response.headers.get("Set-Cookie");
    assert.match(setCookie, /HttpOnly/i);
    const cookie    = setCookie.split(";")[0];
    const dashboard = await get(base, "/dashboard", cookie);
    assert.equal(dashboard.status, 200);
    assert.equal(dashboard.headers.get("Cache-Control"), "no-store");
    const html = await dashboard.text();
    assert.match(html, /Sophie/);
    assert.match(html, /Martin/);
    assert.match(html, /Vos dernières performances/);
    assert.match(html, /Cette semaine/);
    assert.doesNotMatch(html, /password123|"token"|mock-[a-f0-9]{8}-/);
    assert.match(html, /Distance totale parcourue/);
    assert.match(html, /Conditions générales/);
    const historical = await get(base, "/dashboard?distanceWeek=2025-01-06&heartWeek=2025-01-13", cookie);
    assert.equal(historical.status, 200);
    const historicalHtml = await historical.text();
    assert.match(historicalHtml, /2025-01-06/);
    assert.match(historicalHtml, /2025-01-13/);
    const invalidPeriod = await get(base, "/dashboard?heartWeek=2025-02-30", cookie);
    assert.equal(invalidPeriod.status, 400);
    assert.match(await invalidPeriod.text(), /Réinitialiser les dates/);
    const profile = await get(base, "/profile", cookie);
    assert.equal(profile.status, 200);
    assert.match(await profile.text(), /Mon profil/);
    const loginPage = await get(base, "/", cookie);
    assert.equal(loginPage.headers.get("Location"), "/dashboard");

    const getLogout = await get(base, "/logout", cookie);
    assert.equal(getLogout.headers.get("Set-Cookie"), null);
    assert.equal((await get(base, "/dashboard", cookie)).status, 200);
    const crossOrigin = await post(base, "/logout", {}, { cookie, origin: "https://other-site.example" });
    assert.equal(crossOrigin.status, 403);
    const logout = await post(base, "/logout", {}, { cookie });
    assert.equal(logout.status, 302);
    assert.match(logout.headers.get("Set-Cookie"), /Expires=Thu, 01 Jan 1970/i);
    assert.equal((await get(base, "/dashboard")).status, 302);
    if (mode === "mock") {
      assert.equal((await get(base, "/images/mocks/sophie.jpg")).status, 200);
      assert.equal((await get(apiAppUrl, "/dashboard", cookie)).status, 302);
    }
  });
}

test("invalid upstream tokens destroy the cookie and request a new login", async () => {
  const cookie   = await createCookieWithToken("invalid-api-token");
  const response = await get(apiAppUrl, "/dashboard", cookie);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("Location"), "/?reason=session-expired");
  assert.match(response.headers.get("Set-Cookie"), /Expires=Thu, 01 Jan 1970/i);
  const login = await get(apiAppUrl, "/?reason=session-expired");
  assert.match(await login.text(), /Votre session a expiré/);
});

test("network failures show a recoverable error and preserve an existing session", async () => {
  const login = await post(offlineAppUrl, "/?index", { username: "sophiemartin", password: "password123" });
  assert.equal(login.status, 503);
  assert.match(await login.text(), /Impossible de joindre le service/);
  const cookie    = await createCookieWithToken("existing-api-token");
  const dashboard = await get(offlineAppUrl, "/dashboard", cookie);
  assert.equal(dashboard.status, 503);
  assert.match(await dashboard.text(), /Réessayer/);
  assert.equal(dashboard.headers.get("Set-Cookie"), null);
});
