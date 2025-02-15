import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pcneyqkzoxaabfkbbnjf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbmV5cWt6b3hhYWJma2JibmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzODE5ODEsImV4cCI6MjA1NDk1Nzk4MX0.glJE0qashfB65mhc6TFMhCsy-_scFoPMOe65Azxh7UU";

// Automatically set the correct redirect URL based on environment
const REDIRECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-vercel-app.vercel.app"
    : "http://localhost:3000";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    redirectTo: REDIRECT_URL,
  },
});

export default supabase;