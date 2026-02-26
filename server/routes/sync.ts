import { Router, Request, Response } from "express";
import { supabase } from "../db.ts";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const ALLOWED_TABLES = ["products", "sales", "expenses", "debts"];

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

  try {
    for (const op of operations) {
      const { type, table, data } = op;

      // Only allow writes to core data tables — never auth tables
      if (!ALLOWED_TABLES.includes(table)) {
        return res.status(403).json({ error: `Table "${table}" is not writable via sync` });
      }

      if (type === "INSERT") {
        const { error } = await supabase.from(table).insert(data);
        if (error) throw error;

      } else if (type === "UPDATE") {
        const { id, ...updates } = data;
        if (!id) throw new Error(`UPDATE on "${table}" missing id field`);
        const { error } = await supabase.from(table).update(updates).eq("id", id);
        if (error) throw error;

      } else if (type === "DELETE") {
        if (!data.id) throw new Error(`DELETE on "${table}" missing id field`);
        const { error } = await supabase.from(table).delete().eq("id", data.id);
        if (error) throw error;

      } else {
        return res.status(400).json({ error: `Unknown operation type: ${type}` });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Sync failed" });
  }
});

export default router;