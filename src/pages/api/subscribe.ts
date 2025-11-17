import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const lang = formData.get("lang")?.toString() || "unknown";

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Local (sin BBDD)
    if (!import.meta.env.VXGEAR_DB_URL) {
      console.log("⚠ Stored locally:", { email, lang });
      return new Response(JSON.stringify({ success: true, local: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Producción
    const { createPool } = await import("@vercel/postgres");
    const pool = createPool({ connectionString: import.meta.env.VXGEAR_DB_URL });
    const client = await pool.connect();

    await client.sql`
      INSERT INTO subscribers (email, lang)
      VALUES (${email}, ${lang})
      ON CONFLICT (email) DO UPDATE SET lang = ${lang};
    `;

    client.release();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("API ERROR", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

