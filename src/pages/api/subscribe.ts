import type { APIRoute } from "astro";
import { createPool } from "@vercel/postgres";

export const prerender = false;

const pool = createPool({
  connectionString: import.meta.env.DATABASE_URL,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const email = form.get("email")?.toString();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    const client = await pool.connect();

    await client.sql`
      INSERT INTO subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING;
    `;

    client.release();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
};
