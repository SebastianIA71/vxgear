export const GET: APIRoute = async () => {
  try {
    const client = await pool.connect();

    const result = await client.sql`
      SELECT MAX(id)::int AS max_id FROM subscribers;
    `;

    client.release();

    const total = result.rows[0].max_id ?? 0;

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

