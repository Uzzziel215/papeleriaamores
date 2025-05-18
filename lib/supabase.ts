import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js"; // Keep createClient for supabaseAdmin if needed
import type { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qoqchpazcfstknthdizp.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcWNocGF6Y2ZzdGtudGhkaXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDYzMDUsImV4cCI6MjA2MjU4MjMwNX0.wUKoaC0B-mrQQBRJ620ILfcqJ7Qv7xsjUEQVUEeQcaE";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// **CORRECTED** Supabase client for client component operations
// Use createClientComponentClient for Next.js App Router client components
export const supabase = createClientComponentClient<Database>({ 
  supabaseUrl: supabaseUrl,
  supabaseKey: supabaseAnonKey,
});

// Cliente con rol de servicio para operaciones administrativas (not used in frontend for user sessions)
// This still uses the regular createClient as it's for server-side/admin tasks
export const supabaseAdmin = supabaseServiceKey ? createClient<Database>(supabaseUrl, supabaseServiceKey) : null;
