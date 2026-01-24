import axios from "axios";
import { supabase } from "./supabase";

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
