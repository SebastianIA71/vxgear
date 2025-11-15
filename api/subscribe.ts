import { createPool } from '@vercel/postgres';

// Pool para Neon
const pool = createPool({
  connectionString: process.env.VXGEAR_DB_URL,
});

// Vercel Functions usan este handler
export default async function handler(req: Request): Promise<Response> {
  try {
    // Solo aceptar POST
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // IMPORTANTE: leer body como formData (Vercel lo soporta)
    const form = await req.formData();
    const email = form.get("email")?.toString();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Guardar en BD
    const client = await pool.connect();
    await client.sql`
      INSERT INTO subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING;
    `;
    client.release();

    // RESPUESTA OK
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("ERROR SERVERLESS:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
