import { Pool } from "pg";
import dns from "dns";

dns.setDefaultResultOrder('ipv4first');

export const pool = new Pool({
  host: process.env.HOST,
  port: 5432,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  ssl: { rejectUnauthorized: false },
});
