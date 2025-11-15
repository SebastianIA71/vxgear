import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      VXGEAR_DB_URL: import.meta.env.VXGEAR_DB_URL ? "OK" : "MISSING"
    }),
    { status: 200 }
  );
};
