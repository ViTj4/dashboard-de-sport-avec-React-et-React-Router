import { data } from "react-router";
import Dashboard from "~/pages/Dashboard/Dashboard.jsx";
import RouteErrorPanel from "~/components/RouteErrorPanel/RouteErrorPanel.jsx";
import { buildDashboardData, getActivityRequestRange, getDashboardPeriods } from "~/domain/dashboard/dashboard.js";
import { getAuthSession, destroyAuthSession } from "~/services/session.server.js";
import { userService } from "~/services/sportsee.server.js";
import { getServiceErrorMessage, isAuthenticationError } from "~/errors/ServiceError.js";

export const headers = () => ({ "Cache-Control": "no-store" });

export async function loader({ request }) {
  const session = await getAuthSession(request);
  if (!session) throw await destroyAuthSession(request);

  try {
    const periods = getDashboardPeriods(new URL(request.url).searchParams);
    const sessions = await userService.getUserActivity(session.token, {
      ...getActivityRequestRange(periods), signal: request.signal,
    });
    return buildDashboardData(sessions, periods);
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (isAuthenticationError(error)) throw await destroyAuthSession(request, { expired: true });
    throw data({ message: error.code === "VALIDATION_ERROR"
      ? "La période demandée est invalide. Revenez au dashboard pour réinitialiser les dates."
      : getServiceErrorMessage(error) }, { status: error.status === 400 ? 400 : 503 });
  }
}

export default function DashboardRoute() {
  return <Dashboard />;
}

export function ErrorBoundary() {
  return <RouteErrorPanel title="Impossible de charger vos performances" />;
}
