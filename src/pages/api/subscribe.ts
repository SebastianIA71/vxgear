import type { APIRoute } from "astro";
import { createPool } from "@vercel/postgres";

let pool: ReturnType<typeof createPool> | null = null;

// Solo crear pool si existe la variable (producción)
if (import.meta.env.VXGEAR_DB_URL) {
  pool = createPool({
    connectionString: import.meta.env.VXGEAR_DB_URL,
  });
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Si NO hay base de datos → estamos en local → no insertamos
    if (!pool) {
      console.warn("⚠ No DB available (local dev). Email stored as fake success:", email);

      return new Response(JSON.stringify({ success: true, local: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // PRODUCCIÓN (Vercel)
    const client = await pool.connect();
    await client.sql`
      INSERT INTO subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING;
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
