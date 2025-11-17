import type { APIRoute } from "astro";

export const prerender = false;

const WEBSITE_ID = "d7a9ed2d-2e4d-427e-aa15-2a38853d4650"; // tu ID real
const TOKEN = import.meta.env.UMAMI_API_TOKEN;
const UMAMI_URL = "https://cloud.umami.is/api/websites";

export const GET: APIRoute = async () => {
  try {
    // Umami requiere fechas obligatorias
    const startAt = 0;                      // desde el principio
    const endAt = Date.now();              // hasta ahora

    const res = await fetch(
      `${UMAMI_URL}/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return new Response(
      JSON.stringify({
        views: data.pageviews?.value ?? 0,
        visitors: data.visitors?.value ?? 0,
        raw: data, // debug temporal
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ views: 0 }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
