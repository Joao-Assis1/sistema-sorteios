<script setup>
defineProps({
  rank: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
})
</script>

<template>
  <div class="winner-card">
    <h3 class="rank">{{ rank }}</h3>
    <div class="info-row">
      <span class="icon">🏆</span>
      <span
        >Ganhador: <strong>{{ name }}</strong></span
      >
    </div>
    <div class="info-row">
      <span class="icon">📅</span>
      <span
        >Sorteado em: <strong>{{ date }}</strong></span
      >
    </div>
  </div>
</template>

<style scoped>
.winner-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  width: 100%;
  max-width: 300px;
  box-shadow: var(--shadow-card);
  text-align: center;
  color: var(--color-text-dark);
}

.rank {
  margin-top: 0;
  color: #1a1a1a;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.info-row strong {
  color: #000;
  margin-left: 4px;
}

.icon {
  margin-right: 8px;
  color: var(--color-primary);
}
</style>
