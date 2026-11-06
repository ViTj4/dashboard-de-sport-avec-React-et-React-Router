import { data, redirect } from "react-router";
import HomeLogin from "~/pages/HomeLogin/HomeLogin.jsx";
import { readLoginForm } from "~/domain/auth/credentials.js";
import { getServiceErrorMessage, isAuthenticationError } from "~/errors/ServiceError.js";
import { authService } from "~/services/sportsee.server.js";
import { createAuthSession, getAuthSession } from "~/services/session.server.js";
import { assertSameOriginPost } from "~/utils/http.server.js";

// Les réponses de connexion ne doivent pas être conservées en cache.
export const headers = () => ({ "Cache-Control": "no-store" });

/** Prépare le message d'expiration et évite de montrer la connexion à une session déjà présente. */
export async function loader({ request }) {
  if (await getAuthSession(request)) return redirect("/dashboard");

  return {
    notice: new URL(request.url).searchParams.get("reason") === "session-expired"
      ? "Votre session a expiré. Veuillez vous reconnecter."
      : null,
  };
}

/** Valide les champs, authentifie côté serveur, puis crée la session en cas de succès. */
export async function action({ request }) {
  assertSameOriginPost(request);
  const { credentials, errors } = readLoginForm(await request.formData());

  if (Object.keys(errors).length) {
    return data({ errors, username: credentials.username }, { status: 400 });
  }

  try {
    const session = await authService.login(credentials, { signal: request.signal });
    return await createAuthSession(session);
  } catch (error) {
    // Une navigation annulée doit rester une annulation, sans devenir un message de panne.
    if (request.signal.aborted) throw error;

    return data({
      error: isAuthenticationError(error)
        ? "Nom d’utilisateur ou mot de passe incorrect."
        : getServiceErrorMessage(error),
      // Le mot de passe n'est jamais renvoyé au navigateur après un échec.
      username: credentials.username,
    }, { status: isAuthenticationError(error) ? 401 : 503 });
  }
}

export default function Home() {
  return <HomeLogin />;
}
