import { createPool } from '@vercel/postgres';

// Crear pool de conexión reutilizable
const pool = createPool({
  connectionString: process.env.VXGEAR_DB_URL,
});

// Función auxiliar para leer form-urlencoded
async function readBody(req: Request): Promise<string> {
  const buf = await req.arrayBuffer();
  return Buffer.from(buf).toString("utf-8");
}

export default async function handler(req: Request): Promise<Response> {
  try {

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Leer el body crudo
    const raw = await readBody(req);

    // Parsear form-data
    const params = new URLSearchParams(raw);
    const email = params.get("email");

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Insertar en base de datos
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
    console.error("SERVER ERROR", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
