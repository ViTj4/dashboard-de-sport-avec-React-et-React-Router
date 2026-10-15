import { createCookieSessionStorage, redirect } from "react-router";
import { env } from "../config/env.server.js";

const storage = createCookieSessionStorage({
  cookie: {
    name: "sportsee_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: env.isProduction,
    secrets: [env.sessionSecret],
    maxAge: 24 * 60 * 60,
  },
});

export async function getAuthSession(request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  const userId = session.get("userId");

  if (session.get("source") !== env.dataSource ||
      typeof token !== "string" || !token || typeof userId !== "string" || !userId) {
    return null;
  }

  return { token, userId };
}

export async function createAuthSession({ token, userId }) {
  const session = await storage.getSession();
  session.set("token", token);
  session.set("userId", userId);
  session.set("source", env.dataSource);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
      "Cache-Control": "no-store",
    },
  });
}

export async function destroyAuthSession(request, { expired = false } = {}) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect(expired ? "/?reason=session-expired" : "/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
      "Cache-Control": "no-store",
    },
  });
}
