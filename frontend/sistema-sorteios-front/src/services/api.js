import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ewbctljhkxhhawflfogy.supabase.co";
const supabaseKey = "sb_publishable_CzPALNStOxmqZh7GXE5z2g_91G578V_";
const supabase = createClient(supabaseUrl, supabaseKey);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

// O INTERCEPTADOR MÁGICO 🧙‍♂️
api.interceptors.request.use(
  async (config) => {
    // 1. Pega a sessão atual do usuário no navegador
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 2. Se tiver sessão (usuário logado), anexa o Token
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
