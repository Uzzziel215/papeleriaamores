import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qoqchpazcfstknthdizp.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcWNocGF6Y2ZzdGtudGhkaXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDYzMDUsImV4cCI6MjA2MjU4MjMwNX0.wUKoaC0B-mrQQBRJ620ILfcqJ7Qv7xsjUEQVUEeQcaE"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cliente con rol de servicio para operaciones administrativas
export const supabaseAdmin = supabaseServiceKey ? createClient<Database>(supabaseUrl, supabaseServiceKey) : supabase
