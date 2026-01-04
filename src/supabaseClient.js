// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Supabase URL present in build?", !!supabaseUrl);
console.log("Supabase anon key present in build?", !!supabaseAnonKey);

let supabase = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY");
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialised successfully");
} catch (err) {
  console.error("Failed to initialise Supabase client:", err);
}

export { supabase };
