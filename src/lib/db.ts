import { createPool } from "@vercel/postgres";

export const pool = createPool({
  connectionString: import.meta.env.VXGEAR_DB_URL,
});
