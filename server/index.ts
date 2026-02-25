import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.ts";
import syncRoutes from "./routes/sync.ts";

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error("Database connection details are not defined");
}

const app = express();
const PORT = 3001;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
