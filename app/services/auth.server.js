import { createServiceError } from "../errors/ServiceError.js";

export function createAuthService(repository) {
  return {
    async login(credentials, options) {
      const session = await repository.login(credentials, options);

      if (typeof session?.token !== "string" || !session.token ||
          typeof session?.userId !== "string" || !session.userId) {
        throw createServiceError("Invalid authentication response.", { code: "INVALID_RESPONSE" });
      }

      return { token: session.token, userId: session.userId };
    },
  };
}
