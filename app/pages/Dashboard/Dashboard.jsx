import StatusPanel from "~/components/StatusPanel/StatusPanel.jsx";
import { useAuth } from "~/hooks/useAuth.js";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <StatusPanel title={`Bonjour ${user.firstName}`}>
      <p>Vous êtes connecté à SportSee.</p>
    </StatusPanel>
  );
}
