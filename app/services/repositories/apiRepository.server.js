import axios from "axios";
import { createServiceError } from "../../errors/ServiceError.js";
import { validateActivityRange } from "../../domain/activity/dateRange.js";

/** Isole HTTP derrière un contrat commun ; le client injectable permet de tester sans réseau. */
export function createApiRepository({ baseURL, client = axios.create({ baseURL, timeout: 10000 }) }) {
  async function request(config) {
    try {
      const response = await client.request(config);
      return response.data;
    } catch (error) {
      // Une annulation de requête ne doit pas être convertie en erreur réseau.
      if (axios.isCancel(error)) throw error;

      const timedOut = ["ECONNABORTED", "ETIMEDOUT"].includes(error.code);
      throw createServiceError("SportSee API request failed.", {
        status: error.response?.status ?? 503,
        code: timedOut ? "TIMEOUT" : error.response ? "HTTP_ERROR" : "NETWORK_ERROR",
        cause: error,
      });
    }
  }

  // L'en-tête est créé pour chaque appel : aucun token n'est partagé entre utilisateurs.
  function authenticatedGet(url, token, { signal, params } = {}) {
    return request({
      method: "get",
      url,
      signal,
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return {
    login(credentials, { signal } = {}) {
      return request({ method: "post", url: "/api/login", data: credentials, signal });
    },
    getUserInfo(token, { signal } = {}) {
      return authenticatedGet("/api/user-info", token, { signal });
    },
    getUserActivity(token, { startWeek, endWeek, signal }) {
      validateActivityRange({ startWeek, endWeek });
      return authenticatedGet("/api/user-activity", token, {
        signal,
        params: { startWeek, endWeek },
      });
    },
  };
}
