import { redirect } from "react-router";
import { destroyAuthSession } from "~/services/session.server.js";
import { assertSameOriginPost } from "~/utils/http.server.js";

export function loader() {
  return redirect("/");
}

export async function action({ request }) {
  assertSameOriginPost(request);
  return destroyAuthSession(request);
}
