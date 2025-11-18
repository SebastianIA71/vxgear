import type { APIRoute } from "astro";
import { pool } from "@/lib/db";

export const GET: APIRoute = async () => {
  try {
    const client = await pool.connect();

    const result = await client.sql`
      SELECT COUNT(*) AS total FROM subscribers;
    `;

    client.release();

    const total = Number(result.rows[0].total) || 0;

    return new Response(
      JSON.stringify({ total }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("COUNT ERROR:", err);

    return new Response(
      JSON.stringify({ total: 0 }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
