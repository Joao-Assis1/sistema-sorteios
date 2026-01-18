import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ewbctljhkxhhawflfogy.supabase.co";
const supabaseKey = "sb_publishable_CzPALNStOxmqZh7GXE5z2g_91G578V_";

export const supabase = createClient(supabaseUrl, supabaseKey);
