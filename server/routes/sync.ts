import { Router, Request, Response } from "express";
import { pool } from "../db.ts";

const router = Router();

interface SyncOperation {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  data: Record<string, unknown>;
}

router.post("/upload", async (req: Request, res: Response) => {
  const { operations } = req.body as { operations: SyncOperation[] };

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

export default router;
