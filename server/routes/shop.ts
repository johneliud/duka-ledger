import { Router, type Request, type Response } from "express";
import { supabase } from "../db.ts";
import jwt from "jsonwebtoken";

const router = Router();

// Middleware to verify JWT
const authenticate = (req: Request, res: Response, next: () => void) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { shop_id: string; user_id: string };
    (req as unknown as { user: typeof decoded }).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get("/members", authenticate, async (req: Request, res: Response) => {
  const { shop_id } = (req as unknown as { user: { shop_id: string } }).user;

  try {
    const { data, error } = await supabase
      .from("shop_members")
      .select("user_id, role, users!inner(id, name, id_number)")
      .eq("shop_id", shop_id);

    if (error) throw error;

    const members = data?.map((m) => ({
      id: (m.users as unknown as { id: string }).id,
      name: (m.users as unknown as { name: string }).name,
      id_number: (m.users as unknown as { id_number: string }).id_number,
      role: m.role,
    }));

    res.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

export default router;
