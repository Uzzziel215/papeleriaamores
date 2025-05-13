import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qoqchpazcfstknthdizp.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcWNocGF6Y2ZzdGtudGhkaXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDYzMDUsImV4cCI6MjA2MjU4MjMwNX0.wUKoaC0B-mrQQBRJ620ILfcqJ7Qv7xsjUEQVUEeQcaE"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Function to get the anonymous session ID from sessionStorage
const getAnonSessionId = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem("cart_session_id");
  }
  return null;
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (input, init) => {
      const anonSessionId = getAnonSessionId();
      const headers = new Headers(init?.headers);

      // Only add the header if anonSessionId exists and the user is not authenticated
      // (Supabase SDK handles auth token automatically for authenticated users)
      if (anonSessionId && !(headers.has('Authorization'))) {
         headers.set('x-anon-session-id', anonSessionId);
      }

      // Use the modified headers in the fetch call
      return fetch(input, {
        ...init,
        headers,
      });
    },
  },
});

// Cliente con rol de servicio para operaciones administrativas
export const supabaseAdmin = supabaseServiceKey ? createClient<Database>(supabaseUrl, supabaseServiceKey) : supabase;
