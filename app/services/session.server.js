import { createCookieSessionStorage, redirect } from "react-router";
import { env } from "../config/env.server.js";

// La signature protège l'intégrité du cookie, pas sa confidentialité ; HttpOnly bloque sa lecture par JavaScript.
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

/** Relit la session signée ; la validité du token est ensuite contrôlée par la source de données. */
export async function getAuthSession(request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const token = session.get("token");
  const userId = session.get("userId");

  // Une session API ne doit jamais être réutilisée après un passage au mock, et inversement.
  if (session.get("source") !== env.dataSource ||
      typeof token !== "string" || !token || typeof userId !== "string" || !userId) {
    return null;
  }

  return { token, userId };
}

/** Conserve les identifiants dans le cookie HttpOnly, sans les inclure dans les données des pages. */
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

/** Expire le cookie et distingue une déconnexion volontaire d'une session refusée. */
export async function destroyAuthSession(request, { expired = false } = {}) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect(expired ? "/?reason=session-expired" : "/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
      "Cache-Control": "no-store",
    },
  });
}
