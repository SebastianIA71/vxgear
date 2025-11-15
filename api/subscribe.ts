import { VercelRequest, VercelResponse } from '@vercel/node';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.VXGEAR_DB_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // --- PARSEAR BODY FORM-DATA ---
    const rawBody = await getRawBody(req);
    const params = new URLSearchParams(rawBody.toString());
    const email = params.get("email");

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const client = await pool.connect();
    
    await client.sql`
      INSERT INTO subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING;
    `;
    
    client.release();

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// --- Utilidad para leer FORM POST ---
function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);
    req.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
