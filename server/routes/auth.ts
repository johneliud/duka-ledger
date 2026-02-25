import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../db.ts";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

router.post("/token", (req: Request, res: Response) => {
  const { shop_id, user_id } = req.body;

  if (!shop_id || !user_id) {
    return res.status(400).json({ error: "shop_id and user_id required" });
  }

  const token = jwt.sign({ shop_id, user_id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

router.post("/login", async (req: Request, res: Response) => {
  const { id_number, pin } = req.body;
  
  if (!id_number || !pin) {
    return res.status(400).json({ error: "id_number and pin required" });
  }

  try {
    const userResult = await pool.query(
      'SELECT id, name, pin_hash FROM users WHERE id_number = $1',
      [id_number]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const pinMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

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

router.post("/register", async (req: Request, res: Response) => {
  const { name, id_number, pin, shop_name } = req.body;
  
  if (!name || !id_number || !pin || !shop_name) {
    return res.status(400).json({ error: "name, id_number, pin, and shop_name required" });
  }

  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id_number = $1',
      [id_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const pin_hash = await bcrypt.hash(pin, 10);

    await pool.query('BEGIN');

    const userResult = await pool.query(
      'INSERT INTO users (name, id_number, pin_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, id_number, pin_hash]
    );
    const userId = userResult.rows[0].id;

    const inviteCode = `DUKA-${Math.floor(1000 + Math.random() * 9000)}`;

    const shopResult = await pool.query(
      'INSERT INTO shops (name, invite_code) VALUES ($1, $2) RETURNING id',
      [shop_name, inviteCode]
    );
    const shopId = shopResult.rows[0].id;

    await pool.query(
      'INSERT INTO shop_members (user_id, shop_id, role) VALUES ($1, $2, $3)',
      [userId, shopId, 'owner']
    );

    await pool.query('COMMIT');

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

router.post("/join", async (req: Request, res: Response) => {
  const { name, id_number, pin, invite_code } = req.body;
  
  if (!name || !id_number || !pin || !invite_code) {
    return res.status(400).json({ error: "name, id_number, pin, and invite_code required" });
  }

  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  try {
    const shopResult = await pool.query(
      'SELECT id, name FROM shops WHERE invite_code = $1',
      [invite_code]
    );

    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    const shop = shopResult.rows[0];

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id_number = $1',
      [id_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const pin_hash = await bcrypt.hash(pin, 10);

    await pool.query('BEGIN');

    const userResult = await pool.query(
      'INSERT INTO users (name, id_number, pin_hash) VALUES ($1, $2, $3) RETURNING id',
      [name, id_number, pin_hash]
    );
    const userId = userResult.rows[0].id;

    await pool.query(
      'INSERT INTO shop_members (user_id, shop_id, role) VALUES ($1, $2, $3)',
      [userId, shop.id, 'member']
    );

    await pool.query('COMMIT');

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

export default router;
