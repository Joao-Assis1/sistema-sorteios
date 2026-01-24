import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ewbctljhkxhhawflfogy.supabase.co";
// NOTA: A chave abaixo é um placeholder. Você deve configurar VITE_SUPABASE_ANON_KEY no seu .env
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);
