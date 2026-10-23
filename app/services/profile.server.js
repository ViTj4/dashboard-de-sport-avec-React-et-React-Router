import { buildProfileStatistics, getProfilePeriod } from "../domain/profile/statistics.js";

export function createProfileService(userService) {
  return {
    async getProfile(token, { signal, today } = {}) {
      const user = await userService.getUserInfo(token, { signal });
      const period = getProfilePeriod(user.createdAt, today);
      const sessions = await userService.getUserActivity(token, {
        startWeek: period.start, endWeek: period.end, signal,
      });
      return { user, period, statistics: buildProfileStatistics(user, sessions, period) };
    },
  };
}
