<template>
  <div class="min-h-screen bg-green-50 w-full text-gray-800 font-sans">
    <!-- Header -->
    <header
      class="bg-[#154734] text-white px-6 py-4 flex justify-between items-center shadow-md"
    >
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold tracking-wide">Painel de Sorteios</h1>
      </div>
      <div class="flex gap-4">
        <router-link
          to="/"
          class="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition items-center gap-2"
        >
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Consulta de Participantes
        </router-link>
        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <span>Sair</span>
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1 -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div class="p-3 bg-green-50 rounded-full">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">
              Total de Participantes
            </p>
            <p class="text-2xl font-bold text-green-700">
              {{ stats?.total_participants ?? 0 }}
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div class="p-3 bg-yellow-50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-yellow-600"
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
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total de Sorteios</p>
            <p class="text-2xl font-bold text-yellow-600">
              {{ stats?.total_draws ?? 0 }}
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div class="p-3 bg-blue-50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-blue-600"
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
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Último Sorteio</p>
            <p class="text-xl font-bold text-blue-600">
              {{ loading ? "..." : stats.last_draw_date || "Nenhum" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit">
        <button
          @click="currentTab = 'participantes'"
          :class="[
            'px-6 py-2 rounded-lg text-sm font-medium transition',
            currentTab === 'participantes'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          Participantes
        </button>
        <button
          @click="currentTab = 'historico'"
          :class="[
            'px-6 py-2 rounded-lg text-sm font-medium transition',
            currentTab === 'historico'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800',
          ]"
        >
          Histórico
        </button>
      </div>

      <!-- Content Area -->
      <div
        v-if="currentTab === 'participantes'"
        class="space-y-6 animate-fade-in-up"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Section A: Add Participant (Accordion) -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <!-- Accordion Header -->
            <button
              @click="accordionAddOpen = !accordionAddOpen"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3
                class="text-lg font-bold text-gray-800 flex items-center gap-2"
              >
                <span class="w-1 h-6 bg-green-500 rounded-full"></span>
                Adicionar Participante Manual
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500 transition-transform duration-300"
                :class="{ 'rotate-180': accordionAddOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <!-- Accordion Content -->
            <div
              class="transition-all duration-300 ease-in-out overflow-hidden"
              :class="
                accordionAddOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              "
            >
              <div class="px-6 pb-6">
                <form @submit.prevent="handleAddParticipant" class="space-y-4">
                  <input
                    v-model="newParticipant.name"
                    type="text"
                    placeholder="Nome Completo"
                    class="w-full px-4 py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    v-model="newParticipant.email"
                    type="email"
                    placeholder="Email"
                    class="w-full px-4 py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                  <input
                    v-model="newParticipant.phone"
                    type="tel"
                    placeholder="Telefone"
                    class="w-full px-4 py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      :disabled="loadingAdd"
                      class="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2"
                    >
                      <svg
                        v-if="loadingAdd"
                        class="animate-spin h-4 w-4"
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
                        loadingAdd ? "Adicionando..." : "Adicionar"
                      }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Section B: Draw (Accordion) -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <!-- Accordion Header -->
            <button
              @click="accordionDrawOpen = !accordionDrawOpen"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3
                class="text-lg font-bold text-gray-800 flex items-center gap-2"
              >
                <span class="w-1 h-6 bg-yellow-500 rounded-full"></span>
                Realizar Sorteio
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500 transition-transform duration-300"
                :class="{ 'rotate-180': accordionDrawOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <!-- Accordion Content -->
            <div
              class="transition-all duration-300 ease-in-out overflow-hidden"
              :class="
                accordionDrawOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              "
            >
              <div class="px-6 pb-6">
                <p class="text-gray-500 text-sm mb-6">
                  Configure o prêmio e realize o sorteio aleatório entre os
                  participantes qualificados.
                </p>
                <input
                  v-model="drawForm.prize"
                  type="text"
                  placeholder="Prêmio do Sorteio (ex: iPhone 15 pro)"
                  class="w-full px-4 py-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-yellow-500 outline-none mb-4"
                />
                <button
                  @click="handleDraw"
                  :disabled="loadingDraw"
                  class="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/20"
                >
                  <svg
                    v-if="loadingDraw"
                    class="animate-spin h-6 w-6"
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
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-yellow-400"
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
                  <span>{{
                    loadingDraw ? "Sorteando..." : "Sortear Ganhador"
                  }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section C: Search -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">
            Pesquisar Participantes
          </h3>
          <div class="relative mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              class="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 absolute left-4 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Results only appear when searching -->
          <div v-if="searchQuery.trim()" class="transition-all duration-300">
            <p class="text-sm text-gray-500 mb-4">
              Encontrados:
              <span class="font-bold text-green-700">{{
                filteredParticipants.length
              }}</span>
              participante(s)
            </p>

            <!-- Participants Table -->
            <div v-if="filteredParticipants.length > 0" class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th
                      class="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                    >
                      Nome
                    </th>
                    <th
                      class="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                    >
                      Email
                    </th>
                    <th
                      class="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                    >
                      Telefone
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="p in filteredParticipants"
                    :key="p.id"
                    class="hover:bg-gray-50 transition"
                  >
                    <td
                      class="px-4 py-3 whitespace-nowrap text-gray-900 font-medium"
                    >
                      {{ p.name }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ p.email }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">
                      {{ p.phone || "-" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-gray-400">
              Nenhum participante encontrado.
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-fade-in-up"
      >
        <!-- History Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th
                  class="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                >
                  Vencedor
                </th>
                <th
                  class="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                >
                  Email
                </th>
                <th
                  class="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                >
                  Telefone
                </th>
                <th
                  class="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                >
                  Prêmio
                </th>
                <th
                  class="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                >
                  Data
                </th>
                <th
                  class="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-semibold"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="historyList.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-400">
                  Nenhum sorteio realizado ainda.
                </td>
              </tr>
              <tr
                v-for="(draw, idx) in historyList"
                :key="draw.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <div class="bg-yellow-100 p-1.5 rounded-full text-yellow-600">
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
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900">{{
                    draw.isRevealed ? draw.winner : maskName(draw.winner)
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                  {{ draw.isRevealed ? draw.email : maskEmail(draw.email) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                  {{ draw.isRevealed ? draw.phone : maskPhone(draw.phone) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-green-600 font-medium"
                >
                  {{ draw.prize }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                  {{ draw.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="toggleReveal(idx)"
                    :class="[
                      'p-2 rounded-full transition',
                      draw.isRevealed
                        ? 'text-green-600 bg-green-50 hover:bg-green-100'
                        : 'text-blue-500 bg-blue-50 hover:bg-blue-100',
                    ]"
                    :title="draw.isRevealed ? 'Ocultar dados' : 'Revelar dados'"
                  >
                    <!-- Eye Open -->
                    <svg
                      v-if="!draw.isRevealed"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <!-- Eye Closed -->
                    <svg
                      v-else
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button
        @click="testarInvasao"
        class="bg-red-600 text-white p-2 rounded mt-4"
      >
        💀 Testar Invasão
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import Swal from "sweetalert2";
import { supabase } from "../services/supabase";

// Função de Teste de Segurança
const testarInvasao = async () => {
  console.log("🕵️ Tentando inserir membro sem permissão...");

  const { data, error } = await supabase.from("lastlink_members").insert([
    {
      id: "hacker-123",
      nome: "Hacker Teste",
      email: "hacker@teste.com",
      status: "active",
    },
  ]);

  if (error) {
    console.error("⛔ SUCESSO! O Supabase bloqueou:", error.message);
    alert("Segurança confirmada! O Supabase bloqueou a inserção.");
  } else {
    console.error("⚠️ PERIGO! A inserção funcionou. Revise suas Policies.");
    alert("Cuidado! O membro foi inserido.");
  }
};

const router = useRouter();

// State
const currentTab = ref("participantes");
const searchQuery = ref("");
const loadingAdd = ref(false);
const loadingDraw = ref(false);
const loading = ref(false);
const loadingSearch = ref(false);
const loadingHistory = ref(false);
const errorMessage = ref("");

// Accordion states
const accordionAddOpen = ref(false);
const accordionDrawOpen = ref(true);

const stats = ref({
  total_participants: 0,
  total_draws: 0,
  last_draw_date: "Carregando...",
});

const participantsList = ref([]); // Resultados da pesquisa
const historyList = ref([]);

const newParticipant = ref({
  name: "",
  email: "",
  phone: "",
});

const drawForm = ref({
  prize: "",
});

// Debounce timer
let searchTimeout = null;

// ============================================
// TAREFA 1: Pesquisa com Debounce
// ============================================
const searchParticipants = async (query) => {
  if (!query.trim()) {
    participantsList.value = [];
    return;
  }

  loadingSearch.value = true;
  try {
    const response = await api.get(
      `/admin/members?search=${encodeURIComponent(query)}`,
    );
    console.log("Resultados da busca:", response.data);

    // Mapeia os dados retornados (backend usa 'nome' e 'telefone')
    participantsList.value = (response.data || []).map((member) => ({
      id: member.id,
      name: member.nome || member.name,
      email: member.email,
      phone: member.telefone || member.phone || "-",
    }));
  } catch (error) {
    console.error("Erro na busca:", error);
    participantsList.value = [];
  } finally {
    loadingSearch.value = false;
  }
};

// Watch searchQuery com debounce de 300ms
watch(searchQuery, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    searchParticipants(newValue);
  }, 300);
});

// Computed para exibir resultados (agora vem direto do API)
const filteredParticipants = computed(() => participantsList.value);

// ============================================
// TAREFA 3: Buscar Histórico ao trocar de aba
// ============================================
const fetchHistory = async () => {
  loadingHistory.value = true;
  try {
    const response = await api.get("/admin/history");
    console.log("Histórico carregado:", response.data);

    historyList.value = (response.data || []).map((item) => ({
      id: item.id,
      date: item.data_sorteio
        ? new Date(item.data_sorteio).toLocaleDateString("pt-BR")
        : "-",
      prize: item.premio || "-",
      winner: item.ganhador_nome || "N/A",
      email: item.ganhador_email || "N/A",
      phone: item.ganhador_telefone || "-",
      isRevealed: false,
    }));
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    historyList.value = [];
  } finally {
    loadingHistory.value = false;
  }
};

// Watch para carregar histórico quando mudar para a aba
watch(currentTab, (newTab) => {
  if (newTab === "historico" && historyList.value.length === 0) {
    fetchHistory();
  }
});

// Mask functions for privacy
const maskName = (name) => {
  if (!name) return "******";
  const parts = name.split(" ");
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + "*".repeat(part.length - 1);
    })
    .join(" ");
};

const maskEmail = (email) => {
  if (!email) return "******";
  const [localPart, domain] = email.split("@");
  if (!domain) return "******";
  const maskedLocal =
    localPart[0] + "*".repeat(Math.max(localPart.length - 1, 3));
  return `${maskedLocal}@${domain}`;
};

const maskPhone = (phone) => {
  if (!phone || phone === "-") return "-";
  if (phone.length <= 4) return "****";
  const visible =
    phone.slice(0, 2) + "*".repeat(phone.length - 4) + phone.slice(-2);
  return visible;
};

// Toggle reveal for history row
const toggleReveal = (index) => {
  historyList.value[index].isRevealed = !historyList.value[index].isRevealed;
};

// ============================================
// TAREFA 2: Fetch Dashboard Stats
// ============================================
const fetchDashboardData = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await api.get("/admin/dashboard-data");
    console.log("Dados brutos do backend:", response.data);

    // O backend retorna { stats: {...}, participants: [...], history: [...] }
    if (response.data) {
      // Se tiver objeto stats aninhado, usa ele; senão, usa direto
      const statsData = response.data.stats || response.data;

      stats.value = {
        total_participants: statsData.total_participants ?? 0,
        total_draws: statsData.total_draws ?? 0,
        last_draw_date: statsData.last_draw_date || "Nenhum",
      };

      console.log("Stats atualizados:", stats.value);
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    stats.value.last_draw_date = "Erro ao carregar";
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Não foi possível carregar os dados do painel.",
      confirmButtonColor: "#22c55e",
    });
  } finally {
    loading.value = false;
  }
};

const handleAddParticipant = async () => {
  loadingAdd.value = true;
  try {
    await api.post("/admin/participants", newParticipant.value);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Participante adicionado!",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#22c55e",
      color: "#fff",
    });

    newParticipant.value = { name: "", email: "", phone: "" };
    await fetchDashboardData();
  } catch (error) {
    console.error("Error adding participant:", error);
    const errorMsg =
      error.response?.data?.error || "Erro ao adicionar participante.";
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: errorMsg,
      confirmButtonColor: "#22c55e",
    });
  } finally {
    loadingAdd.value = false;
  }
};

const handleDraw = async () => {
  if (!drawForm.value.prize.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Atenção",
      text: "Por favor, informe o prêmio do sorteio.",
      confirmButtonColor: "#22c55e",
    });
    return;
  }

  loadingDraw.value = true;
  try {
    const response = await api.post("/admin/draw", {
      prize: drawForm.value.prize,
    });
    const result = response.data.data;

    Swal.fire({
      icon: "success",
      title: "🎉 Temos um Ganhador!",
      html: `
        <div class="text-center">
          <p class="text-2xl font-bold text-green-700 mb-2">${
            result.winner?.name || result.winner?.nome || "Vencedor"
          }</p>
          <p class="text-gray-500">${result.winner?.email || ""}</p>
          <p class="mt-4 text-lg">Prêmio: <strong class="text-yellow-600">${
            drawForm.value.prize
          }</strong></p>
          <p class="text-sm text-gray-400 mt-2">Total de participantes: ${
            result.total_participants
          }</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Fechar",
      confirmButtonColor: "#22c55e",
      showClass: {
        popup: "animate__animated animate__bounceIn",
      },
    });

    drawForm.value.prize = "";
    await fetchDashboardData();
    // Limpa o histórico para forçar reload na próxima vez
    historyList.value = [];
  } catch (error) {
    console.error("Error performing draw:", error);
    const errorMsg = error.response?.data?.error || "Erro ao realizar sorteio.";
    Swal.fire({
      icon: "error",
      title: "Erro no Sorteio",
      text: errorMsg,
      confirmButtonColor: "#22c55e",
    });
  } finally {
    loadingDraw.value = false;
  }
};

const handleLogout = () => {
  Swal.fire({
    title: "Deseja sair?",
    text: "Você será desconectado do painel.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sim, sair",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  });
};

// Lifecycle
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
</style>
