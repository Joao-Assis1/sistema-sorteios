<script setup>
defineProps({
  title: String,
  value: [String, Number],
  variant: {
    type: String,
    default: 'green', // green, beige, blue
  },
  icon: String,
})
</script>

<template>
  <div class="stat-card" :class="variant">
    <div class="content">
      <span class="title">{{ title }}</span>
      <strong class="value">{{ value }}</strong>
    </div>
    <div class="icon-wrapper">
      <span class="material-icon">{{ icon }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 100px;
}

.title {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: #555; /* Texto escuro suave */
}

/* Variantes de Cor baseadas na imagem */
.stat-card.green {
  background-color: #e8f5e9; /* Fundo verde bem claro */
  border-left: 4px solid var(--color-primary);
}
.stat-card.green .title {
  color: #2e7d32;
}
.stat-card.green .value {
  color: #1b5e20;
}

.stat-card.beige {
  background-color: #fff8e1; /* Fundo amarelado */
  border-left: 4px solid var(--color-secondary);
}
.stat-card.beige .title {
  color: #f57f17;
}
.stat-card.beige .value {
  color: #e65100;
}

.stat-card.blue {
  background-color: #e3f2fd; /* Fundo azul claro */
  border-left: 4px solid #1976d2;
}
.stat-card.blue .title {
  color: #1565c0;
}
.stat-card.blue .value {
  color: #0d47a1;
}

.value {
  font-size: 2rem;
  font-weight: bold;
}

.icon-wrapper {
  font-size: 2rem;
  opacity: 0.5;
}
</style>
