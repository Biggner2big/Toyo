import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ozsnxaxzdclegkyshhic.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_KDoaMAZnkB1L45O96SQ6bw_x5n9wrHs";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
