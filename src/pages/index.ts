export function GET({ request }) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 🚫 No tocar APIs
  if (path.startsWith("/api")) {
    return;
  }

  // 🚫 No tocar assets
  if (path.startsWith("/_astro") || path.startsWith("/img")) {
    return;
  }

  // 🚫 No tocar idiomas ya definidos
  if (path.startsWith("/es") || path.startsWith("/en")) {
    return;
  }

  // ✔ Solo redirigir la raíz "/"
  if (path === "/") {
    return Response.redirect(new URL("/es/", request.url).toString(), 302);
  }

  return;
}

