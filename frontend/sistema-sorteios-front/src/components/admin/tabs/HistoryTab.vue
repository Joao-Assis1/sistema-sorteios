<script setup>
import { onMounted, ref } from 'vue'
import { useRaffleStore } from '@/stores/raffleStore'

const store = useRaffleStore()
const visibleRows = ref(new Set())

// Garante que os dados estejam carregados ao abrir a aba
onMounted(() => {
  if (store.winners.length === 0) {
    store.fetchWinners()
  }
})

// Função para formatar data e hora igual à imagem
const formatDateTime = (date, time) => {
  if (!time) return date
  return `${date}, ${time}`
}

const toggleVisibility = (id) => {
  if (visibleRows.value.has(id)) {
    visibleRows.value.delete(id) // Se já está visível, remove (esconde)
  } else {
    visibleRows.value.add(id) // Se está escondido, adiciona (mostra)
  }
}
</script>

<template>
  <div class="history-container">
    <div class="header-section">
      <h3>Histórico de Sorteios</h3>
      <p>Todos os sorteios realizados anteriormente</p>
    </div>

    <div class="table-responsive">
      <table class="history-table">
        <thead>
          <tr>
            <th>VENCEDOR</th>
            <th>EMAIL</th>
            <th>TELEFONE</th>
            <th>PRÊMIO</th>
            <th>DATA DO SORTEIO</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.isLoadingWinners">
            <td colspan="6" class="text-center">Carregando histórico...</td>
          </tr>

          <tr v-else v-for="winner in store.winners" :key="winner.id">
            <td>
              <div class="winner-cell">
                <span class="trophy-icon">🏆</span>
                <span class="winner-name">{{ winner.name }}</span>
              </div>
            </td>

            <td>
              <span v-if="visibleRows.has(winner.id)" class="revealed-text">{{
                winner.email
              }}</span>
              <span v-else class="masked-text">••••••••</span>
            </td>

            <td>
              <span v-if="visibleRows.has(winner.id)" class="revealed-text">{{
                winner.phone
              }}</span>
              <span v-else class="masked-text">••••••••</span>
            </td>

            <td>{{ winner.prize || winner.rank }}</td>
            <td class="date-cell">
              {{ formatDateTime(winner.date, winner.time) }}
            </td>

            <td>
              <button
                class="action-btn"
                @click="toggleVisibility(winner.id)"
                :title="visibleRows.has(winner.id) ? 'Ocultar dados' : 'Ver dados'"
              >
                {{ visibleRows.has(winner.id) ? '🙈' : '👁️' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!store.isLoadingWinners && store.winners.length === 0" class="empty-state">
        Nenhum sorteio encontrado.
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-section h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.header-section p {
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
  margin-bottom: 1.5rem;
}

/* Tabela */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Garante scroll em telas pequenas */
}

/* Cabeçalho da Tabela */
.history-table th {
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #888;
  font-weight: 600;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

/* Linhas da Tabela */
.history-table td {
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
  color: #333;
}

/* Coluna Vencedor */
.winner-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trophy-icon {
  color: #25d366; /* Verde do ícone */
  font-size: 1.1rem;
}

.winner-name {
  font-weight: 600;
  color: #105e36; /* Verde escuro do nome */
}

/* Texto Mascarado (Bolinhas) */
.masked-text {
  letter-spacing: 2px;
  color: #333;
  font-weight: bold;
  font-size: 1.2rem; /* Aumenta um pouco as bolinhas */
  vertical-align: middle;
}

/* Estilo do Texto Revelado */
.revealed-text {
  font-family: monospace; /* Fonte monoespaçada ajuda na leitura de dados */
  color: #555;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Botão de Ação */
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 1;
}

.text-center {
  text-align: center;
  color: #666;
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}
</style>
