import { mapUserInfo } from "../mappers/userMapper.js";
import { mapActivitySessions } from "../mappers/activityMapper.js";

/** Valide et transforme les réponses du dépôt avant de les transmettre au reste de l'application. */
export function createUserService(repository) {
  return {
    async getUserInfo(token, options) {
      return mapUserInfo(await repository.getUserInfo(token, options));
    },
    async getUserActivity(token, options) {
      return mapActivitySessions(await repository.getUserActivity(token, options));
    },
  };
}
