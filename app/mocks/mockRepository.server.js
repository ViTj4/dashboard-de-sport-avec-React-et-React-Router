import { randomUUID } from "node:crypto";
import mockUsers from "./data/users.json" with { type: "json" };
import { createServiceError } from "../errors/ServiceError.js";
import { validateActivityRange } from "../domain/activity/dateRange.js";

const demoPasswords = {
  sophiemartin: "password123",
  emmaleroy: "password789",
  marcdubois: "password456",
};
const sessionDuration = 24 * 60 * 60 * 1000;

/** Reproduit le contrat de l'API ; l'horloge injectée rend les dates et l'expiration testables. */
export function createMockRepository({ users = mockUsers, now = Date.now } = {}) {
  // Ces sessions opaques sont locales au processus et disparaissent au redémarrage.
  const sessions = new Map();

  function getUser(token, signal) {
    signal?.throwIfAborted();
    const session = sessions.get(token);

    if (!session || session.expiresAt <= now()) {
      sessions.delete(token);
      throw createServiceError("Invalid mock session.", { status: 401 });
    }

    return users.find((user) => user.id === session.userId);
  }

  return {
    async login({ username, password }, { signal } = {}) {
      signal?.throwIfAborted();
      const user = users.find((candidate) => candidate.username === username);

      if (!user || demoPasswords[username] !== password) {
        throw createServiceError("Invalid credentials.", { status: 401 });
      }

      for (const [token, session] of sessions) {
        if (session.expiresAt <= now()) sessions.delete(token);
      }

      const token = `mock-${randomUUID()}`;
      sessions.set(token, { userId: user.id, expiresAt: now() + sessionDuration });
      return { token, userId: user.id };
    },
    async getUserInfo(token, { signal } = {}) {
      const user = getUser(token, signal);
      return {
        // Les copies empêchent un consommateur de modifier le jeu de données commun.
        profile: structuredClone(user.profile),
        statistics: {
          // Comme l'API actuelle, ces totaux incluent toutes les activités, même futures.
          totalDistance: user.activities.reduce((sum, session) => sum + session.distance, 0).toFixed(1),
          totalSessions: user.activities.length,
          totalDuration: user.activities.reduce((sum, session) => sum + session.duration, 0),
        },
      };
    },
    async getUserActivity(token, { startWeek, endWeek, signal }) {
      const user = getUser(token, signal);
      validateActivityRange({ startWeek, endWeek });
      // La liste datée, contrairement aux totaux, exclut les activités futures.
      const today = new Date(now()).toISOString().slice(0, 10);
      return structuredClone(user.activities
        .filter((session) => session.date >= startWeek && session.date <= endWeek && session.date <= today)
        .toSorted((first, second) => first.date.localeCompare(second.date)));
    },
  };
}
