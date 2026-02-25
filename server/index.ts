import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/token", (req: Request, res: Response) => {
  const { shop_id, user_id } = req.body;

  if (!shop_id || !user_id) {
    return res.status(400).json({ error: "shop_id and user_id required" });
  }

  const token = jwt.sign({ shop_id, user_id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// Mock auth endpoints for development
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { id_number, pin } = req.body;
  
  if (!id_number || !pin) {
    return res.status(400).json({ error: "id_number and pin required" });
  }

  try {
    // Find user by ID number
    const userResult = await pool.query(
      'SELECT id, name, pin_hash FROM users WHERE id_number = $1',
      [id_number]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    // Verify PIN
    const pinMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Get user's shop membership
    const membershipResult = await pool.query(
      `SELECT sm.shop_id, sm.role, s.name as shop_name 
       FROM shop_members sm 
       JOIN shops s ON s.id = sm.shop_id 
       WHERE sm.user_id = $1 
       LIMIT 1`,
      [user.id]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(404).json({ error: "No shop found for user" });
    }

    const membership = membershipResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { shop_id: membership.shop_id, user_id: user.id },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, id_number },
      shop: { id: membership.shop_id, name: membership.shop_name },
      role: membership.role
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, id_number, pin, shop_name } = req.body;
  
  if (!name || !id_number || !pin || !shop_name) {
    return res.status(400).json({ error: "name, id_number, pin, and shop_name required" });
  }

  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id_number = $1',
      [id_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash PIN
    const pin_hash = await bcrypt.hash(pin, 10);

    // Start transaction
    await pool.query('BEGIN');

    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (name, id_number, pin_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, id_number, pin_hash]
    );
    const userId = userResult.rows[0].id;

    // Generate invite code
    const inviteCode = `DUKA-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create shop
    const shopResult = await pool.query(
      'INSERT INTO shops (name, invite_code) VALUES ($1, $2) RETURNING id',
      [shop_name, inviteCode]
    );
    const shopId = shopResult.rows[0].id;

    // Add user as shop owner
    await pool.query(
      'INSERT INTO shop_members (user_id, shop_id, role) VALUES ($1, $2, $3)',
      [userId, shopId, 'owner']
    );

    await pool.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { shop_id: shopId, user_id: userId },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: { id: userId, name, id_number },
      shop: { id: shopId, name: shop_name, invite_code: inviteCode },
      role: "owner"
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/join", async (req: Request, res: Response) => {
  const { name, id_number, pin, invite_code } = req.body;
  
  if (!name || !id_number || !pin || !invite_code) {
    return res.status(400).json({ error: "name, id_number, pin, and invite_code required" });
  }

  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  try {
    // Find shop by invite code
    const shopResult = await pool.query(
      'SELECT id, name FROM shops WHERE invite_code = $1',
      [invite_code]
    );

    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    const shop = shopResult.rows[0];

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id_number = $1',
      [id_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash PIN
    const pin_hash = await bcrypt.hash(pin, 10);

    // Start transaction
    await pool.query('BEGIN');

    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (name, id_number, pin_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, id_number, pin_hash]
    );
    const userId = userResult.rows[0].id;

    // Add user as shop member
    await pool.query(
      'INSERT INTO shop_members (user_id, shop_id, role) VALUES ($1, $2, $3)',
      [userId, shop.id, 'member']
    );

    await pool.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { shop_id: shop.id, user_id: userId },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: { id: userId, name, id_number },
      shop: { id: shop.id, name: shop.name },
      role: 'member'
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Join error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

interface SyncOperation {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  data: Record<string, unknown>;
}

app.post("/api/sync/upload", async (req: Request, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
