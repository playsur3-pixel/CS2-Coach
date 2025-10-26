import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hjnafjcasknyodzwwbop.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbmFmamNhc2tueW9kend3Ym9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjI4NTEsImV4cCI6MjA3Njc5ODg1MX0.-eYX4Ih6Y3s-78DcbiJghjpvQm1U2oo1S4v44Uyz1JM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
