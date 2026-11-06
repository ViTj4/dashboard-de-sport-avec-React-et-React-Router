import { data } from "react-router";
import Profile from "~/pages/Profile/Profile.jsx";
import RouteErrorPanel from "~/components/RouteErrorPanel/RouteErrorPanel.jsx";
import { getServiceErrorMessage, isAuthenticationError } from "~/errors/ServiceError.js";
import { getAuthSession, destroyAuthSession } from "~/services/session.server.js";
import { profileService } from "~/services/sportsee.server.js";

// Le layout partagé lit cette métadonnée pour choisir la largeur de la page.
export const handle = { wideContent: true };
export const headers = () => ({ "Cache-Control": "no-store" });

/** Charge le profil complet côté serveur et conserve le token hors des données sérialisées. */
export async function loader({ request }) {
  // Le loader enfant protège aussi ses propres requêtes, même si le parent vérifie déjà la session.
  const session = await getAuthSession(request);
  if (!session) throw await destroyAuthSession(request);

  try {
    return await profileService.getProfile(session.token, { signal: request.signal });
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (isAuthenticationError(error)) throw await destroyAuthSession(request, { expired: true });
    throw data({ message: getServiceErrorMessage(error) }, { status: 503 });
  }
}

export default function ProfileRoute() {
  return <Profile />;
}

export function ErrorBoundary() {
  return <RouteErrorPanel title="Impossible de charger votre profil" />;
}
