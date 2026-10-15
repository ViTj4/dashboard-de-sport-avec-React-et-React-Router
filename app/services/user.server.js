import { mapUserInfo } from "../mappers/userMapper.js";
import { createServiceError } from "../errors/ServiceError.js";

export function createUserService(repository) {
  return {
    async getUserInfo(token, options) {
      return mapUserInfo(await repository.getUserInfo(token, options));
    },
    async getUserActivity(token, options) {
      const sessions = await repository.getUserActivity(token, options);
      if (!Array.isArray(sessions)) {
        throw createServiceError("Invalid activity response.", { code: "INVALID_RESPONSE" });
      }
      return sessions;
    },
  };
}
