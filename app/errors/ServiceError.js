export function createServiceError(message, { status = 500, code = "SERVICE_ERROR", cause } = {}) {
  return Object.assign(new Error(message, { cause }), {
    name: "ServiceError",
    status,
    code,
  });
}

export function isAuthenticationError(error) {
  return error?.name === "ServiceError" && [401, 403].includes(error.status);
}

export function getServiceErrorMessage(error) {
  if (error?.code === "NETWORK_ERROR") {
    return "Impossible de joindre le service. Veuillez réessayer dans un instant.";
  }

  if (error?.code === "TIMEOUT") {
    return "Le service met trop de temps à répondre. Veuillez réessayer.";
  }

  return "Le service est momentanément indisponible. Veuillez réessayer.";
}
