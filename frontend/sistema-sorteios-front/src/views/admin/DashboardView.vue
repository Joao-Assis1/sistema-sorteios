<script setup>
import { ref } from 'vue'
import { useRaffleStore } from '@/stores/raffleStore'
import AdminLayout from '@/layouts/AdminLayout.vue' // Importando o Layout Localmente
import StatCard from '@/components/admin/StatCard.vue'
import ParticipantsTab from '@/components/admin/tabs/ParticipantsTab.vue'
import HistoryTab from '@/components/admin/tabs/HistoryTab.vue'

const store = useRaffleStore()
const currentTab = ref('participants') // 'participants' ou 'history'
const setTab = (tab) => {
  currentTab.value = tab
}
</script>

<template>
  <AdminLayout>
    <div class="stats-grid">
      <StatCard
        title="Total de Participantes"
        :value="store.stats.participants"
        variant="green"
        icon="👥"
      />
      <StatCard
        title="Total de Sorteios"
        :value="store.stats.rafflesCount"
        variant="beige"
        icon="🏆"
      />
      <StatCard
        title="Último Sorteio"
        :value="store.stats.lastRaffleDate"
        variant="blue"
        icon="📅"
      />
    </div>

    <div class="dashboard-tabs">
      <button
        @click="setTab('participants')"
        class="tab-btn"
        :class="{ 'active-green': currentTab === 'participants' }"
      >
        Participantes
      </button>
      <button
        @click="setTab('history')"
        class="tab-btn"
        :class="{ 'active-orange': currentTab === 'history' }"
      >
        Histórico
      </button>
    </div>

    <div class="tab-content-area">
      <ParticipantsTab v-if="currentTab === 'participants'" />

      <HistoryTab v-else-if="currentTab === 'history'" />
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Grid de Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Abas */
.dashboard-tabs {
  display: flex;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  background-color: #e5e7eb; /* Cinza inativo */
  color: #6b7280;
  transition: all 0.2s;
}

/* Estilo quando a aba 'Participantes' está ativa (Verde) */
.tab-btn.active-green {
  background-color: #10b981;
  color: white;
}

/* Estilo quando a aba 'Histórico' está ativa (Laranja/Dourado) */
.tab-btn.active-orange {
  background-color: #f59e0b; /* Tom alaranjado da imagem */
  color: white; /* Ou preto, dependendo da sua preferência de contraste */
}

/* Conteúdo */
.tab-content-area {
  padding-top: 2rem; /* Espaço entre a aba e os cards brancos */
}

.history-placeholder {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  color: #666;
}
</style>
