/** Enrichit une erreur native sans héritage et conserve sa cause pour le diagnostic serveur. */
export function createServiceError(message, { status = 500, code = "SERVICE_ERROR", cause } = {}) {
  return Object.assign(new Error(message, { cause }), {
    name: "ServiceError",
    status,
    code,
  });
}

/** Distingue une session refusée d'une panne pour décider de déconnecter ou de réessayer. */
export function isAuthenticationError(error) {
  return error?.name === "ServiceError" && [401, 403].includes(error.status);
}

/** Fournit un message affichable sans exposer les détails techniques de l'erreur. */
export function getServiceErrorMessage(error) {
  if (error?.code === "NETWORK_ERROR") {
    return "Impossible de joindre le service. Veuillez réessayer dans un instant.";
  }

  if (error?.code === "TIMEOUT") {
    return "Le service met trop de temps à répondre. Veuillez réessayer.";
  }

  return "Le service est momentanément indisponible. Veuillez réessayer.";
}
