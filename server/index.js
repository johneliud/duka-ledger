import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (JWT_SECRET === undefined || !JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/token", (req, res) => {
  const { shop_id, user_id } = req.body;

  if (!shop_id || !user_id) {
    return res.status(400).json({ error: "shop_id and user_id required" });
  }

  const token = jwt.sign({ shop_id, user_id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

app.post("/api/sync/upload", async (req, res) => {
  const { operations } = req.body;

  if (!operations || !Array.isArray(operations)) {
    return res.status(400).json({ error: "operations array required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const op of operations) {
      const { type, table, data } = op;

      if (type === "INSERT") {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
        await client.query(
          `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`,
          values,
        );
      } else if (type === "UPDATE") {
        const { id, ...updates } = data;
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
        await client.query(
          `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1}`,
          [...values, id],
        );
      } else if (type === "DELETE") {
        await client.query(`DELETE FROM ${table} WHERE id = $1`, [data.id]);
      }
    }

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Sync error:", error);
    res.status(500).json({ error: "Sync failed" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
