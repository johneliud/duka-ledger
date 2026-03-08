import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { supabase } from "../db.ts";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const getJwtSecret = (res: Response): string | null => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    res.status(500).json({ error: "JWT_SECRET not configured" });
    return null;
  }
  return JWT_SECRET;
};

router.post("/token", (req: Request, res: Response) => {
  const { shop_id, user_id } = req.body;

  if (!shop_id || !user_id) {
    return res.status(400).json({ error: "shop_id and user_id required" });
  }

  const JWT_SECRET = getJwtSecret(res);
  if (!JWT_SECRET) return;

  const KID = process.env.POWERSYNC_KID;
  const token = jwt.sign({ sub: user_id, shop_id, user_id }, JWT_SECRET, {
    expiresIn: "7d",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    header: { kid: KID, alg: "HS256" } as any,
  });
  res.json({ token });
});

router.post("/register", async (req: Request, res: Response) => {
  const { name, id_number, pin, shop_name } = req.body;

  if (!name || !id_number || !pin || !shop_name) {
    return res
      .status(400)
      .json({ error: "name, id_number, pin, and shop_name required" });
  }

  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  const JWT_SECRET = getJwtSecret(res);
  if (!JWT_SECRET) return;

  try {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id_number", id_number)
      .maybeSingle();

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this ID already exists" });
    }

    const pin_hash = await bcrypt.hash(pin, 10);

    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({ name, id_number, pin_hash })
      .select("id")
      .single();

    if (userError) throw userError;

    // Generate invite code
    const inviteCode = `DUKA-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: newShop, error: shopError } = await supabase
      .from("shops")
      .insert({ name: shop_name, invite_code: inviteCode })
      .select("id")
      .single();

    if (shopError) throw shopError;

    const { error: memberError } = await supabase
      .from("shop_members")
      .insert({ user_id: newUser.id, shop_id: newShop.id, role: "owner" });

    if (memberError) throw memberError;

    const KID = process.env.POWERSYNC_KID;
    const token = jwt.sign(
      {
        sub: newUser.id,
        shop_id: newShop.id,
        user_id: newUser.id,
        role: "owner",
      },
      JWT_SECRET,
      { expiresIn: "7d", header: { kid: KID, alg: "HS256" } as any },
    );

    res.status(201).json({
      token,
      user: { id: newUser.id, name, id_number },
      shop: { id: newShop.id, name: shop_name, invite_code: inviteCode },
      role: "owner",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { id_number, pin } = req.body;

  if (!id_number || !pin) {
    return res.status(400).json({ error: "id_number and pin required" });
  }

  const JWT_SECRET = getJwtSecret(res);
  if (!JWT_SECRET) return;

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, pin_hash")
      .eq("id_number", id_number)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const pinMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { data: membership, error: memberError } = await supabase
      .from("shop_members")
      .select("shop_id, role, shops!inner(name, invite_code)")
      .eq("user_id", user.id)
      .maybeSingle();

    if (memberError) throw memberError;

    if (!membership) {
      return res.status(404).json({ error: "No shop found for this user" });
    }

    const shopData = membership.shops as unknown as {
      name: string;
      invite_code: string;
    };
    const shopName = shopData?.name ?? "";
    const inviteCode = shopData?.invite_code ?? "";

    const KID = process.env.POWERSYNC_KID;
    const token = jwt.sign(
      {
        sub: user.id,
        shop_id: membership.shop_id,
        user_id: user.id,
        role: membership.role,
      },
      JWT_SECRET,
      { expiresIn: "7d", header: { kid: KID, alg: "HS256" } as any },
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, id_number },
      shop: { id: membership.shop_id, name: shopName, invite_code: inviteCode },
      role: membership.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/join", async (req: Request, res: Response) => {
  const { name, id_number, pin, invite_code } = req.body;

  if (!name || !id_number || !pin || !invite_code) {
    return res
      .status(400)
      .json({ error: "name, id_number, pin, and invite_code required" });
  }

  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  const JWT_SECRET = getJwtSecret(res);
  if (!JWT_SECRET) return;

  try {
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, name")
      .eq("invite_code", invite_code.toUpperCase())
      .maybeSingle();

    if (shopError) throw shopError;

    if (!shop) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id_number", id_number)
      .maybeSingle();

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this ID already exists" });
    }

    const pin_hash = await bcrypt.hash(pin, 10);
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({ name, id_number, pin_hash })
      .select("id")
      .single();

    if (userError) throw userError;

    const { error: memberError } = await supabase
      .from("shop_members")
      .insert({ user_id: newUser.id, shop_id: shop.id, role: "member" });

    if (memberError) throw memberError;

    const KID = process.env.POWERSYNC_KID;
    const token = jwt.sign(
      {
        sub: newUser.id,
        shop_id: shop.id,
        user_id: newUser.id,
        role: "member",
      },
      JWT_SECRET,
      { expiresIn: "7d", header: { kid: KID, alg: "HS256" } as any },
    );

    res.status(201).json({
      token,
      user: { id: newUser.id, name, id_number },
      shop: {
        id: shop.id,
        name: shop.name,
        invite_code: invite_code.toUpperCase(),
      },
      role: "member",
    });
  } catch (error) {
    console.error("Join error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
