import type { APIRoute } from "astro";

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

    // 🔥 LOCAL: NO HAY DB_URL → devolvemos success inmediato
    if (!import.meta.env.VXGEAR_DB_URL) {
      console.log("⚠ Development mode: email no almacenado (local).", email);
      return new Response(JSON.stringify({ success: true, local: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔥 PRODUCCIÓN: cargar dinámicamente la librería SOLO aquí
    const { createPool } = await import("@vercel/postgres");

    const pool = createPool({
      connectionString: import.meta.env.VXGEAR_DB_URL,
    });

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
