import { buildProfileStatistics, getProfilePeriod } from "../domain/profile/statistics.js";

/** Compose profil et activités via le service injecté, identique en mode API et mock. */
export function createProfileService(userService) {
  return {
    async getProfile(token, { signal, today } = {}) {
      // La date d'inscription détermine la plage de la seconde requête ; l'ordre est donc nécessaire.
      const user = await userService.getUserInfo(token, { signal });
      const period = getProfilePeriod(user.createdAt, today);
      const sessions = await userService.getUserActivity(token, {
        startWeek: period.start, endWeek: period.end, signal,
      });
      return { user, period, statistics: buildProfileStatistics(user, sessions, period) };
    },
  };
}
