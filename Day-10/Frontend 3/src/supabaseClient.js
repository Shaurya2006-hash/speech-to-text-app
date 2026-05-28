import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://krzmjbvgrugvydzyvtsd.supabase.co";

const supabaseAnonKey =
  "sb_publishable_X6VfvNmhwya4V2ECE5eP9g_9rmOG3T4";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );