import { data, isRouteErrorResponse, Outlet, useRevalidator, useRouteError } from "react-router";
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout/AuthenticatedLayout.jsx";
import Button from "~/components/Button/Button.jsx";
import StatusPanel from "~/components/StatusPanel/StatusPanel.jsx";
import { getServiceErrorMessage, isAuthenticationError } from "~/errors/ServiceError.js";
import { getAuthSession, destroyAuthSession } from "~/services/session.server.js";
import { userService } from "~/services/sportsee.server.js";

export const headers = () => ({ "Cache-Control": "no-store" });

export async function loader({ request }) {
  const session = await getAuthSession(request);
  if (!session) throw await destroyAuthSession(request);

  try {
    const user = await userService.getUserInfo(session.token, { signal: request.signal });
    return { user: { id: session.userId, ...user } };
  } catch (error) {
    if (request.signal.aborted) throw error;
    if (isAuthenticationError(error)) {
      throw await destroyAuthSession(request, { expired: true });
    }
    throw data({ message: getServiceErrorMessage(error) }, { status: 503 });
  }
}

export default function AuthenticatedRoute() {
  return <AuthenticatedLayout><Outlet /></AuthenticatedLayout>;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  return (
    <AuthenticatedLayout>
      <StatusPanel title="Impossible de charger votre espace">
        <p role="alert">{isRouteErrorResponse(error) ? error.data?.message : getServiceErrorMessage(error)}</p>
        <Button onClick={() => revalidator.revalidate()} disabled={revalidator.state !== "idle"}>
          Réessayer
        </Button>
      </StatusPanel>
    </AuthenticatedLayout>
  );
}
