export function GET({ request }) {
  const url = new URL("/es/", request.url);
  return Response.redirect(url.toString(), 302);
}

