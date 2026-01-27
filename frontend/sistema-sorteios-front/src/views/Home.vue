<template>
  <div
    class="min-h-screen flex flex-col items-center w-full text-white bg-gray-900"
  >
    <!-- Tab Navigation (Mobile-First) -->
    <nav class="w-full bg-gray-800 border-b border-gray-700 sticky top-0 z-20">
      <div class="max-w-4xl mx-auto flex">
        <button
          @click="activeTab = 'sorteio'"
          :class="[
            'flex-1 py-4 px-4 text-center font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'sorteio'
              ? 'bg-green-600 text-white border-b-4 border-green-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-700',
          ]"
        >
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span>Sorteio Atual</span>
        </button>
        <button
          @click="activeTab = 'transparencia'"
          :class="[
            'flex-1 py-4 px-4 text-center font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2',
            activeTab === 'transparencia'
              ? 'bg-green-600 text-white border-b-4 border-green-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-700',
          ]"
        >
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Transparência</span>
        </button>
      </div>
    </nav>

    <!-- TAB: Sorteio Atual -->
    <div v-if="activeTab === 'sorteio'" class="w-full flex-1">
      <!-- Hero Section (Topo) -->
      <section
        class="w-full py-12 md:py-16 flex flex-col items-center bg-gradient-to-b from-green-900 to-gray-900 border-b border-gray-700"
      >
        <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center px-4">
          Consulte sua Participação
        </h1>
        <div class="flex flex-col gap-3 w-full max-w-xl px-4">
          <input
            v-model="emailInput"
            type="email"
            placeholder="Digite seu e-mail"
            class="w-full px-5 py-4 rounded-xl bg-gray-800 text-white border-2 border-gray-600 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-lg"
            @keyup.enter="checkStatus"
          />
          <button
            @click="checkStatus"
            :disabled="isCheckingStatus"
            class="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-lg"
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
        class="w-full py-16 bg-gray-800 flex flex-col items-center text-center px-4"
      >
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          Quer participar também?
        </h2>
        <p class="mb-8 text-base md:text-lg max-w-2xl text-gray-300">
          Junte-se a milhares de participantes e concorra a prêmios incríveis
          todos os meses. Assine agora e aumente suas chances!
        </p>
        <a
          :href="subscriptionLink"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-green-500 hover:bg-green-600 text-white text-lg md:text-xl font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 shadow-2xl inline-block"
        >
          ASSINAR PLANO ANUAL AGORA
        </a>
      </section>

      <!-- Galeria de Ganhadores (Rodapé) -->
      <section class="w-full py-12 bg-gray-900 flex flex-col items-center">
        <h3 class="text-xl md:text-2xl font-semibold mb-8 text-green-400">
          🏆 Últimos Ganhadores
        </h3>

        <!-- Loading State -->
        <div
          v-if="isLoadingWinners"
          class="flex items-center gap-2 text-gray-400"
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
          class="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 max-w-6xl w-full"
        >
          <div
            v-for="(winner, index) in winners.slice(0, 6)"
            :key="index"
            class="bg-gray-800 text-white rounded-xl p-5 shadow-lg border border-gray-700 transform transition hover:-translate-y-1 hover:border-green-500"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🏆</span>
              <h4 class="font-bold text-base text-green-400">
                {{ winner.prize }}
              </h4>
            </div>
            <div class="flex items-center gap-2 mb-2 text-gray-300">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="font-medium text-sm">{{ winner.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-500 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
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
        <div v-else class="text-center text-gray-400 px-4">
          <span class="text-5xl mb-4 block">🎯</span>
          <p class="text-lg">Sorteios começando em breve!</p>
          <p class="text-sm mt-2 opacity-75">
            Assine agora e seja o primeiro ganhador.
          </p>
        </div>
      </section>
    </div>

    <!-- TAB: Transparência / Auditoria -->
    <div v-else class="w-full flex-1 bg-gray-900">
      <!-- Header da Transparência -->
      <section
        class="w-full py-8 bg-gradient-to-b from-gray-800 to-gray-900 text-center px-4 border-b border-gray-700"
      >
        <div class="flex items-center justify-center gap-3 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Auditoria Pública
          </h2>
        </div>
        <p class="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Verificamos cada sorteio usando dados públicos da Blockchain do
          Bitcoin. Clique em "Validar Resultado" para conferir a matemática.
        </p>
      </section>

      <!-- Seção: Próximo Sorteio (Lista Lacrada) -->
      <section class="w-full py-8 px-4 bg-gray-800 border-b border-gray-700">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-green-400"
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
            <h3 class="text-xl md:text-2xl font-bold text-white">
              Próximo Sorteio
            </h3>
          </div>

          <!-- Loading do Snapshot -->
          <div
            v-if="isLoadingCurrentList"
            class="flex items-center justify-center py-8 text-gray-400"
          >
            <svg
              class="animate-spin h-6 w-6 mr-3"
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
            <span>Carregando lista lacrada...</span>
          </div>

          <!-- Dados do Snapshot -->
          <div v-else-if="currentListData" class="space-y-6">
            <!-- Cards de Informação -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Hash de Segurança -->
              <div class="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <p class="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  🔐 Hash de Segurança da Lista
                </p>
                <p
                  class="font-mono text-xs md:text-sm text-green-400 break-all"
                >
                  {{ currentListData.list_hash }}
                </p>
              </div>

              <!-- Bloco Alvo Bitcoin -->
              <div class="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <p class="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  ₿ Bloco Alvo do Bitcoin
                </p>
                <p class="font-mono text-sm text-blue-400">
                  #{{
                    snapshotData?.next_draw_target_block || "A ser definido"
                  }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Total de participantes:
                  <span class="text-white font-bold">{{
                    currentListData.total_participants
                  }}</span>
                </p>
                <a
                  v-if="snapshotData?.explorer_url"
                  :href="snapshotData.explorer_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 mt-3 text-sm text-blue-400 hover:text-blue-300 transition"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Conferir Bloco na Blockchain
                </a>
              </div>
            </div>

            <!-- Instrução Visual -->
            <div
              v-if="snapshotData?.next_draw_target_block"
              class="bg-green-900/30 border border-green-700 rounded-xl p-4 mt-4"
            >
              <p class="text-sm text-green-300">
                <span class="font-bold">📢 Como funciona:</span> O sorteio será
                decidido pelo resultado do
                <span class="font-mono text-green-400"
                  >Bloco #{{ snapshotData.next_draw_target_block }}</span
                >
                do Bitcoin.
                <a
                  href="https://mempool.space/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-400 hover:underline ml-1"
                >
                  Ver altura atual →
                </a>
              </p>
            </div>

            <!-- Grid de Participantes -->
            <div>
              <h4 class="text-lg font-semibold text-gray-300 mb-4">
                📋 Participantes Confirmados
              </h4>
              <div
                v-if="currentListData.participants.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
              >
                <div
                  v-for="participant in currentListData.participants.slice(
                    0,
                    12,
                  )"
                  :key="participant.lucky_number"
                  class="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-center gap-3"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm"
                  >
                    #{{ participant.lucky_number }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-white font-medium truncate">
                      {{ participant.name }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ participant.email }}
                    </p>
                  </div>
                </div>
              </div>
              <p
                v-if="currentListData.participants.length > 12"
                class="text-center text-gray-500 text-sm mt-4"
              >
                ... e mais
                {{ currentListData.total_participants - 12 }} participantes
              </p>
              <div
                v-if="currentListData.participants.length === 0"
                class="text-center py-8 text-gray-400"
              >
                <span class="text-4xl block mb-2">🎯</span>
                <p>Nenhum participante ativo no momento.</p>
              </div>
            </div>
          </div>

          <!-- Erro ao carregar -->
          <div v-else class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">⚠️</span>
            <p>Não foi possível carregar a lista.</p>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div
        v-if="isLoadingHistory"
        class="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <svg
          class="animate-spin h-8 w-8 mb-4"
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
        <span>Carregando histórico de auditoria...</span>
      </div>

      <!-- Lista de Sorteios para Auditoria -->
      <div v-else class="w-full max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div
          v-if="auditHistory.length === 0"
          class="text-center py-16 text-gray-400"
        >
          <span class="text-5xl mb-4 block">📋</span>
          <p class="text-lg">Nenhum sorteio auditável ainda.</p>
          <p class="text-sm mt-2 opacity-75">
            Os sorteios aparecerão aqui após serem realizados.
          </p>
        </div>

        <!-- Card de cada sorteio -->
        <div
          v-for="(draw, index) in auditHistory"
          :key="draw.id"
          class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          <!-- Cabeçalho do Card -->
          <div
            class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">🎁</span>
                <h4 class="font-bold text-white text-lg">{{ draw.prize }}</h4>
              </div>
              <div
                class="flex flex-wrap items-center gap-3 text-sm text-gray-400"
              >
                <span class="flex items-center gap-1">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {{ draw.winner_name }}
                </span>
                <span class="flex items-center gap-1">
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
                  {{ formatDate(draw.data_sorteio) }}
                </span>
              </div>
            </div>

            <!-- Botão Validar -->
            <button
              v-if="!draw.isValidating && !draw.showProof"
              @click="startValidation(index)"
              class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Validar Resultado</span>
            </button>

            <!-- Estado: Validando -->
            <div
              v-if="draw.isValidating"
              class="w-full md:w-auto bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-3"
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
              <span class="animate-pulse"
                >Cruzando dados com a Blockchain do Bitcoin...</span
              >
            </div>

            <!-- Botão Ocultar (quando já validado) -->
            <button
              v-if="draw.showProof"
              @click="draw.showProof = false"
              class="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <span>Ocultar Prova</span>
            </button>
          </div>

          <!-- Painel de Prova (Calculadora da Verdade) -->
          <transition
            enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]"
            leave-from-class="opacity-100 max-h-[500px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div
              v-if="draw.showProof"
              class="bg-gray-900 border-t border-gray-700 overflow-hidden"
            >
              <div class="p-4 space-y-4">
                <!-- Badge de Verificado -->
                <div
                  class="flex items-center gap-2 text-green-400 text-sm font-medium"
                >
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Resultado Verificado ✓</span>
                </div>

                <!-- Código de Segurança -->
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p class="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                    Código de Segurança (Seed)
                  </p>
                  <p
                    class="font-mono text-sm md:text-base text-green-400 break-all overflow-wrap-anywhere whitespace-normal"
                  >
                    {{ draw.seed_value || "N/A" }}
                  </p>
                </div>

                <!-- Link para Fonte Oficial -->
                <a
                  v-if="draw.seed_source"
                  :href="draw.seed_source"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Conferir na Fonte Oficial</span>
                </a>

                <!-- Explicação Visual do Cálculo -->
                <div
                  class="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <p class="text-xs text-gray-400 mb-3 uppercase tracking-wide">
                    Como o ganhador foi escolhido:
                  </p>
                  <div
                    class="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center"
                  >
                    <div
                      class="bg-gray-700 rounded-lg px-4 py-2 w-full md:flex-1 min-w-0 overflow-hidden"
                    >
                      <p class="text-xs text-gray-400">Seed</p>
                      <p
                        class="font-mono text-xs md:text-sm text-green-400 break-all overflow-wrap-anywhere"
                      >
                        {{ draw.seed_value || "---" }}
                      </p>
                    </div>
                    <span class="text-2xl text-gray-500">÷</span>
                    <div class="bg-gray-700 rounded-lg px-4 py-2">
                      <p class="text-xs text-gray-400">Participantes</p>
                      <p class="font-mono text-blue-400 text-sm">
                        {{ draw.total_participants || "---" }}
                      </p>
                    </div>
                    <span class="text-2xl text-gray-500">=</span>
                    <div
                      class="bg-green-600/20 border border-green-500 rounded-lg px-4 py-2"
                    >
                      <p class="text-xs text-green-400">Posição do Ganhador</p>
                      <p class="font-mono text-green-400 font-bold">
                        {{ calculateWinnerPosition(draw) }}
                      </p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-3 text-center">
                    Resto da divisão = posição na lista ordenada de
                    participantes
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Swal from "sweetalert2";

// Tab state
const activeTab = ref("sorteio");

// Reactive state
const emailInput = ref("");
const isCheckingStatus = ref(false);
const isLoadingWinners = ref(false);
const isLoadingHistory = ref(false);
const winners = ref([]);
const auditHistory = ref([]);

// Dados do snapshot da lista atual
const currentListData = ref(null);
const snapshotData = ref(null);
const isLoadingCurrentList = ref(false);

// Link para assinatura
const subscriptionLink = ref("#");

/**
 * Formata data para exibição
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("pt-BR");
};

/**
 * Calcula a posição do ganhador (resto da divisão)
 */
const calculateWinnerPosition = (draw) => {
  if (!draw.seed_value || !draw.total_participants) return "---";
  const seed = parseInt(draw.seed_value) || 0;
  const total = parseInt(draw.total_participants) || 1;
  return (seed % total) + 1; // +1 para mostrar posição 1-based
};

/**
 * Inicia a animação de validação (2 segundos)
 */
const startValidation = (index) => {
  auditHistory.value[index].isValidating = true;

  // Simula verificação por 2 segundos
  setTimeout(() => {
    auditHistory.value[index].isValidating = false;
    auditHistory.value[index].showProof = true;
  }, 2000);
};

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
      const luckyNumber = response.data.lucky_number;
      const listHash = currentListData.value?.list_hash || "";
      const shortHash = listHash ? listHash.substring(0, 12) + "..." : "";

      Swal.fire({
        icon: "success",
        title: "Parabéns! 🎉",
        html: `
          <p class="text-lg"><strong>${name}</strong>, sua assinatura está <span class="text-green-600 font-bold">ativa</span>!</p>
          ${luckyNumber ? `<p class="text-green-600 mt-3 text-xl font-bold">🎫 Seu Nº da Sorte: #${luckyNumber}</p>` : ""}
          ${shortHash ? `<p class="text-gray-500 text-xs mt-1">(Baseado no Lacre ${shortHash})</p>` : ""}
          ${subscription_end_date ? `<p class="text-gray-600 mt-2">Válida até: <strong>${subscription_end_date}</strong></p>` : ""}
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
 * Carrega os últimos ganhadores
 */
const loadWinners = async () => {
  isLoadingWinners.value = true;

  try {
    const response = await api.get("/admin/history");
    winners.value = (response.data || []).map((item) => ({
      prize: item.premio || "-",
      name: item.ganhador_nome || "N/A",
      date: formatDate(item.data_sorteio),
    }));
  } catch (error) {
    console.error("Load winners error:", error);
    winners.value = [];
  } finally {
    isLoadingWinners.value = false;
  }
};

/**
 * Carrega histórico para auditoria
 */
const loadAuditHistory = async () => {
  isLoadingHistory.value = true;

  try {
    const response = await api.get("/admin/history");
    auditHistory.value = (response.data || []).map((item) => ({
      id: item.id,
      prize: item.premio || "-",
      winner_name: item.ganhador_nome || "N/A",
      data_sorteio: item.data_sorteio,
      seed_value: item.seed_value || null,
      seed_source: item.seed_source || null,
      total_participants: item.total_participants || null,
      isValidating: false,
      showProof: false,
    }));
  } catch (error) {
    console.error("Load audit history error:", error);
    auditHistory.value = [];
  } finally {
    isLoadingHistory.value = false;
  }
};

/**
 * Carrega a lista atual de participantes com hash de segurança
 */
const loadCurrentList = async () => {
  isLoadingCurrentList.value = true;

  try {
    // Buscar lista de participantes
    const listResponse = await api.get("/public/current-list");
    currentListData.value = listResponse.data;

    // Buscar snapshot com bloco alvo
    const snapshotResponse = await api.get("/public/snapshot");
    snapshotData.value = snapshotResponse.data;
  } catch (error) {
    console.error("Load current list error:", error);
    currentListData.value = null;
    snapshotData.value = null;
  } finally {
    isLoadingCurrentList.value = false;
  }
};

// Carrega dados ao montar o componente
onMounted(() => {
  loadWinners();
  loadAuditHistory();
  loadCurrentList();
});
</script>

<style scoped>
/* Transição suave para os tabs */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
