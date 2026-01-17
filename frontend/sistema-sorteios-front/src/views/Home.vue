<template>
  <div class="min-h-screen flex flex-col items-center w-full text-white">
    <!-- Hero Section (Topo) -->
    <section
      class="w-full py-16 flex flex-col items-center bg-green-900 border-b border-green-800"
    >
      <h1 class="text-4xl font-bold mb-8 text-center px-4">
        Consulte sua Participação
      </h1>
      <div class="flex flex-col md:flex-row gap-4 w-full max-w-xl px-4">
        <input
          v-model="emailInput"
          type="email"
          placeholder="Digite seu e-mail"
          class="flex-1 px-5 py-4 rounded-lg bg-white text-gray-900 border-2 border-gray-300 shadow-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
          @keyup.enter="checkStatus"
        />
        <button
          @click="checkStatus"
          :disabled="isCheckingStatus"
          class="bg-green-500 hover:bg-green-600 disabled:bg-green-700 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-lg transition shadow-lg flex items-center justify-center gap-2 min-w-[200px]"
        >
          <svg
            v-if="isCheckingStatus"
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{
            isCheckingStatus ? "VERIFICANDO..." : "VERIFICAR STATUS"
          }}</span>
        </button>
      </div>
    </section>

    <!-- Call to Action (Meio) -->
    <section
      class="w-full py-20 bg-[#154734] flex flex-col items-center text-center px-4"
    >
      <h2 class="text-3xl font-bold mb-4">Quer participar também?</h2>
      <p class="mb-8 text-lg max-w-2xl text-green-100">
        Junte-se a milhares de participantes e concorra a prêmios incríveis
        todos os meses. Assine agora e aumente suas chances!
      </p>
      <a
        :href="subscriptionLink"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-10 rounded-xl transition transform hover:scale-105 shadow-2xl inline-block"
      >
        ASSINAR PLANO ANUAL AGORA
      </a>
    </section>

    <!-- Galeria de Ganhadores (Rodapé) -->
    <section class="w-full py-16 bg-green-950/50 flex flex-col items-center">
      <h3 class="text-2xl font-semibold mb-10 text-green-200">
        Últimos Ganhadores
      </h3>

      <!-- Loading State -->
      <div
        v-if="isLoadingWinners"
        class="flex items-center gap-2 text-green-200"
      >
        <svg
          class="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Carregando ganhadores...</span>
      </div>

      <!-- Winners Grid -->
      <div
        v-else-if="winners.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl w-full"
      >
        <div
          v-for="(winner, index) in winners"
          :key="index"
          class="bg-white text-gray-800 rounded-2xl p-6 shadow-lg flex flex-col items-start transform transition hover:-translate-y-1 hover:shadow-xl border border-gray-100"
        >
          <!-- Prêmio (Topo) -->
          <div class="flex items-center gap-2 mb-4 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <h4 class="font-bold text-lg text-gray-900">{{ winner.prize }}</h4>
          </div>

          <!-- Nome do Ganhador (Meio) -->
          <div class="flex items-center gap-2 mb-3 text-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="font-medium">{{ winner.name }}</span>
          </div>

          <!-- Data do Sorteio (Rodapé) -->
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{{ winner.date }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-green-200/80">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-lg">Sorteios começando em breve!</p>
        <p class="text-sm mt-2 opacity-75">
          Assine agora e seja o primeiro ganhador.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Swal from "sweetalert2";

// Reactive state
const emailInput = ref("");
const isCheckingStatus = ref(false);
const isLoadingWinners = ref(false);
const winners = ref([]);

// Link para assinatura (pode ser atualizado para a URL real da Lastlink)
const subscriptionLink = ref("#");

/**
 * Verifica o status da assinatura pelo email
 */
const checkStatus = async () => {
  const email = emailInput.value.trim();

  if (!email) {
    Swal.fire({
      icon: "warning",
      title: "Atenção",
      text: "Por favor, digite seu e-mail para verificar.",
      confirmButtonColor: "#22c55e",
    });
    return;
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "warning",
      title: "E-mail inválido",
      text: "Por favor, digite um e-mail válido.",
      confirmButtonColor: "#22c55e",
    });
    return;
  }

  isCheckingStatus.value = true;

  try {
    const response = await api.get("/public/status", {
      params: { email },
    });

    if (response.data.status === "active") {
      const { name, subscription_end_date } = response.data.user;
      Swal.fire({
        icon: "success",
        title: "Parabéns! 🎉",
        html: `
          <p class="text-lg"><strong>${name}</strong>, sua assinatura está <span class="text-green-600 font-bold">ativa</span>!</p>
          ${
            subscription_end_date
              ? `<p class="text-gray-600 mt-2">Válida até: <strong>${subscription_end_date}</strong></p>`
              : ""
          }
          <p class="text-gray-500 mt-4">Você está concorrendo aos sorteios diários.</p>
        `,
        confirmButtonText: "Ótimo!",
        confirmButtonColor: "#22c55e",
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Assinatura não encontrada",
        html: `
          <p class="text-gray-600">Não encontramos uma assinatura ativa para este e-mail.</p>
          <p class="text-gray-500 mt-4">Que tal assinar agora e começar a concorrer?</p>
        `,
        confirmButtonText: "Quero Assinar!",
        confirmButtonColor: "#22c55e",
        showCancelButton: true,
        cancelButtonText: "Voltar",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed && subscriptionLink.value !== "#") {
          window.open(subscriptionLink.value, "_blank");
        }
      });
    }
  } catch (error) {
    console.error("Status check error:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Não foi possível verificar o status. Tente novamente mais tarde.",
      confirmButtonColor: "#22c55e",
    });
  } finally {
    isCheckingStatus.value = false;
  }
};

/**
 * Carrega os últimos ganhadores ao montar o componente
 */
const loadWinners = async () => {
  isLoadingWinners.value = true;

  try {
    const response = await api.get("/public/winners");
    winners.value = response.data.winners || [];
  } catch (error) {
    console.error("Load winners error:", error);
    // Em caso de erro, mantém array vazio (mostra mensagem de "em breve")
    winners.value = [];
  } finally {
    isLoadingWinners.value = false;
  }
};

// Carrega ganhadores ao montar o componente
onMounted(() => {
  loadWinners();
});
</script>
