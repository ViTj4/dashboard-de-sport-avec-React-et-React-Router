import { useRouteLoaderData } from "react-router";

/** Réutilise le profil du loader parent sans ajouter un contexte ou une requête réseau. */
export function useAuth() {
  const data = useRouteLoaderData("routes/authenticated");
  if (!data?.user) {
    throw new Error("useAuth must be used inside an authenticated route.");
  }
  return { user: data.user };
}
