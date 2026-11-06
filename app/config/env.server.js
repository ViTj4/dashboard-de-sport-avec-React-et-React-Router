import { randomBytes } from "node:crypto";
import { loadEnvFile } from "node:process";

// Le fichier .env est facultatif ; les erreurs de lecture autres qu'un fichier absent restent bloquantes.
try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const dataSource = process.env.DATA_SOURCE || "api";
const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:8000";

if (!["api", "mock"].includes(dataSource)) {
  throw new Error('DATA_SOURCE must be "api" or "mock".');
}

if (!/^https?:$/.test(new URL(apiBaseUrl).protocol)) {
  throw new Error("API_BASE_URL must use HTTP or HTTPS.");
}

const isProduction = process.env.NODE_ENV === "production";
// Le secret temporaire facilite le développement, mais invalide les anciennes sessions au redémarrage.
const sessionSecret = process.env.SESSION_SECRET ||
  (isProduction ? "" : randomBytes(32).toString("hex"));

if (sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters.");
}

// Cette configuration reste côté serveur : aucun secret n'est transmis aux composants React.
export const env = Object.freeze({
  apiBaseUrl,
  dataSource,
  isProduction,
  sessionSecret,
});
