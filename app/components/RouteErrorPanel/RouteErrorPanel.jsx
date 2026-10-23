import { isRouteErrorResponse, Link, useLocation, useRevalidator, useRouteError } from "react-router";
import Button from "~/components/Button/Button.jsx";
import StatusPanel from "~/components/StatusPanel/StatusPanel.jsx";
import { getServiceErrorMessage } from "~/errors/ServiceError.js";

export default function RouteErrorPanel({ title = "Impossible de charger les données" }) {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const location = useLocation();
  const isInvalidPeriod = isRouteErrorResponse(error) && error.status === 400;
  const message = isRouteErrorResponse(error) && typeof error.data?.message === "string"
    ? error.data.message : getServiceErrorMessage(error);

  return (
    <StatusPanel title={title}>
      <p role="alert">{message}</p>
      {isInvalidPeriod ? <Link to={location.pathname} replace>Réinitialiser les dates</Link>
        : <Button onClick={() => revalidator.revalidate()} disabled={revalidator.state !== "idle"}>Réessayer</Button>}
    </StatusPanel>
  );
}
