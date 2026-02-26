import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.ts";
import syncRoutes from "./routes/sync.ts";
import shopRoutes from "./routes/shop.ts";

dotenv.config();

if (!process.env.SUPABASE_DB_URL) {
  throw new Error("Database connection URL are not defined");
}

const app = express();
const PORT = 3001;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/shop", shopRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
