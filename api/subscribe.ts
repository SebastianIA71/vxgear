import { VercelRequest, VercelResponse } from '@vercel/node';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.VXGEAR_DB_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const client = await pool.connect();

    await client.sql`
      INSERT INTO subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING;
    `;

    client.release();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('DB ERROR', err);
    return res.status(500).json({ error: 'Internal DB error' });
  }
}
