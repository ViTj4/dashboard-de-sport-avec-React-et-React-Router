import { redirect } from "react-router";
import { destroyAuthSession } from "~/services/session.server.js";
import { assertSameOriginPost } from "~/utils/http.server.js";

// Visiter l'URL en GET ne déconnecte pas : seule l'action POST modifie la session.
export function loader() {
  return redirect("/");
}

/** Vérifie l'origine de la demande avant d'expirer le cookie. */
export async function action({ request }) {
  assertSameOriginPost(request);
  return destroyAuthSession(request);
}
