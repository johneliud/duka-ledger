import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_SECRET!;

export const supabase = createClient(supabaseUrl, supabaseKey);