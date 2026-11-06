import { createServiceError } from "../errors/ServiceError.js";

/** Accepte le même contrat de dépôt pour une connexion réelle ou simulée. */
export function createAuthService(repository) {
  return {
    async login(credentials, options) {
      const session = await repository.login(credentials, options);

      // Un statut HTTP réussi ne suffit pas : il faut une session exploitable avant de créer le cookie.
      if (typeof session?.token !== "string" || !session.token ||
          typeof session?.userId !== "string" || !session.userId) {
        throw createServiceError("Invalid authentication response.", { code: "INVALID_RESPONSE" });
      }

      return { token: session.token, userId: session.userId };
    },
  };
}
