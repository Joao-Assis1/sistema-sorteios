<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-[#154734] px-4"
  >
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <div class="flex flex-col items-center mb-8">
        <div class="bg-green-100 p-3 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Sorteio Admin</h2>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="admin@exemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Senha</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center"
        >
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="text-sm text-green-600 hover:text-green-800 font-medium"
        >
          Voltar para a página inicial
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../services/supabase";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    // A MÁGICA ACONTECE AQUI ✨
    // Não chamamos mais o seu backend. Chamamos o Supabase direto.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Se deu certo, o usuário já está logado!
    console.log("Logado com sucesso:", data.user);

    // Salva o token no localStorage para o guard de navegação
    if (data.session?.access_token) {
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // Redireciona para o dashboard
    router.push("/admin");
  } catch (error) {
    console.error("Login failed", error);
    alert("Erro ao entrar. Verifique suas credenciais.");
  } finally {
    loading.value = false;
  }
};
</script>
