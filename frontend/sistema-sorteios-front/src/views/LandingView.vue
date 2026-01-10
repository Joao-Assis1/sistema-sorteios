<script setup>
import { ref, onMounted } from 'vue'
import { useRaffleStore } from '@/stores/raffleStore'
import WinnerCard from '@/components/raffles/WinnerCard.vue'

const store = useRaffleStore()
const emailSearch = ref('')

// Ciclo de vida: Busca dados assim que a tela monta
onMounted(() => {
  store.fetchWinners()
})

const handleCheck = () => {
  store.checkStatus(emailSearch.value)
}
</script>

<template>
  <div class="landing-page">
    <div class="content-container">
      <section class="section-hero">
        <h1>Consulte sua Participação</h1>
        <p>Digite seu e-mail cadastrado na Last Link para confirmar sua vaga nos sorteios.</p>

        <div class="search-box">
          <div class="input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              v-model="emailSearch"
              type="email"
              placeholder="Digite o e-mail que você usou na compra"
            />
          </div>
          <button @click="handleCheck" class="btn btn-primary">VERIFICAR STATUS</button>
        </div>
      </section>

      <section class="section-cta">
        <h2>Quer participar também? É fácil!</h2>
        <p>Assine nosso Plano Anual exclusivo e garanta sua participação em TODOS os sorteios.</p>
        <button class="btn btn-primary btn-large">➜ ASSINAR PLANO ANUAL AGORA</button>
        <span class="secure-text">Compra segura e garantida pela Last Link</span>
      </section>

      <section class="section-winners">
        <h2>Conheça Nossos Últimos Ganhadores</h2>

        <div v-if="store.isLoadingWinners" class="loading-state">
          Carregando lista de ganhadores...
        </div>

        <div v-else-if="store.error" class="error-msg">
          {{ store.error }}
        </div>

        <div v-else class="winners-grid">
          <div v-if="store.winners.length === 0" class="empty-msg">
            Nenhum ganhador registrado ainda.
          </div>

          <WinnerCard
            v-for="winner in store.winners"
            :key="winner.id"
            :rank="winner.rank"
            :name="winner.name"
            :date="winner.date"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  background-color: var(--color-primary);
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
}

.content-container {
  max-width: 1000px;
  width: 100%;
  text-align: center;
}

h1,
h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
p {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.search-box {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.winners-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn-large {
  font-size: 1rem;
  padding: 1rem 2rem;
  background-color: var(--color-accent);
}

.secure-text {
  display: block;
  font-size: 0.75rem;
  opacity: 0.6;
  margin-top: 0.5rem;
}

.loading-state,
.empty-msg {
  color: white;
  opacity: 0.8;
  margin-top: 2rem;
}

.error-msg {
  background: rgba(255, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  color: #ffcccc;
  margin-top: 1rem;
}
</style>
