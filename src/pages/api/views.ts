import type { APIRoute } from "astro";

export const prerender = false;

const WEBSITE_ID = "d7a9ed2d-2e4d-427e-aa15-2a38853d4650";
const TOKEN = import.meta.env.UMAMI_API_TOKEN;
const UMAMI_URL = "https://analytics.umami.is"; // si tu panel es otro, cambia

export const GET: APIRoute = async () => {
  const now = Date.now();
  const start = 0; // desde el principio

  try {
    const res = await fetch(
      `${UMAMI_URL}/api/websites/${WEBSITE_ID}/stats?start_at=${start}&end_at=${now}`,
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
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ views: 0 }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
