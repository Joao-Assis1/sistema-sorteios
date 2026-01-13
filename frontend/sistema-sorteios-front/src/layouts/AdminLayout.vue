<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // Futuramente limpar tokens/pinia aqui
  router.push('/')
}
</script>

<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-content">
        <div class="logo-area">
          <span class="icon">🖼️</span>
          <h1>Painel de Sorteios</h1>
        </div>

        <div class="actions">
          <button class="btn btn-blue">🔍 Consulta de Participantes</button>
          <button @click="handleLogout" class="btn btn-red">➜ Sair</button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <div class="container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: var(--color-bg-light); /* Fundo cinza claro */
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: #0d3b24; /* Um verde ainda mais escuro que o primário, conforme imagem */
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-red {
  background-color: #dc3545; /* Vermelho botão sair */
  color: white;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
}

.btn-blue {
  background-color: #3b82f6; /* Azul botão consulta */
  color: white;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
}

.admin-main {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
