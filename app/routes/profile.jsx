import { data } from "react-router";
import Profile from "~/pages/Profile/Profile.jsx";
import RouteErrorPanel from "~/components/RouteErrorPanel/RouteErrorPanel.jsx";
import { getServiceErrorMessage, isAuthenticationError } from "~/errors/ServiceError.js";
import { getAuthSession, destroyAuthSession } from "~/services/session.server.js";
import { profileService } from "~/services/sportsee.server.js";

export const handle = { wideContent: true };
export const headers = () => ({ "Cache-Control": "no-store" });

export async function loader({ request }) {
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
