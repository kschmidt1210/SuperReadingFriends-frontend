import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pcneyqkzoxaabfkbbnjf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbmV5cWt6b3hhYWJma2JibmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzODE5ODEsImV4cCI6MjA1NDk1Nzk4MX0.glJE0qashfB65mhc6TFMhCsy-_scFoPMOe65Azxh7UU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;