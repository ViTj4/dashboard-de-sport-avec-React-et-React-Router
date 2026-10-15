export function assertSameOriginPost(request) {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new Response("Forbidden", { status: 403 });
  }
}
