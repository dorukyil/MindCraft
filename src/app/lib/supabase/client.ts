import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://zxbzwgidcygnacnnebzv.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable__H4ATPbAo7tgJlC_trUo9A_-JI3uchd";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);