<script setup>
import { ref } from 'vue'

// Estado local do formulário (v-model)
const newParticipant = ref({ name: '', email: '', phone: '' })
const rafflePrize = ref('1º Lugar')
const searchText = ref('')

// Ações (Simuladas por enquanto)
const handleAddParticipant = () => {
  console.log('Adicionando:', newParticipant.value)
  alert(`Participante ${newParticipant.value.name} adicionado!`)
  // Limpar formulário
  newParticipant.value = { name: '', email: '', phone: '' }
}

const handleRaffle = () => {
  if (!confirm(`Confirma sortear o prêmio "${rafflePrize.value}"?`)) return
  console.log('Sorteando prêmio:', rafflePrize.value)
}
</script>

<template>
  <div class="tab-container">
    <section class="admin-card">
      <div class="card-header">
        <span class="icon">👤</span>
        <h3>Adicionar Participante Manual</h3>
      </div>
      <p class="card-desc">Cadastre participantes manualmente com email válido.</p>

      <div class="form-grid">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="newParticipant.name" type="text" placeholder="Ex: João Silva" />
        </div>
        <div class="form-group">
          <label>Email do Participante</label>
          <input v-model="newParticipant.email" type="email" placeholder="Ex: joao@email.com" />
        </div>
        <div class="form-group full-width">
          <label>Número de Telefone</label>
          <input v-model="newParticipant.phone" type="text" placeholder="Ex: (11) 99999-9999" />
        </div>
      </div>

      <div class="card-actions">
        <button @click="handleAddParticipant" class="btn btn-success">
          Adicionar Participante
        </button>
      </div>
    </section>

    <section class="admin-card">
      <div class="card-header">
        <span class="icon">🎁</span>
        <h3>Realizar Sorteio</h3>
      </div>
      <p class="card-desc">Defina o prêmio e sorteie um ganhador entre todos os participantes.</p>

      <div class="raffle-row">
        <div class="form-group flex-grow">
          <label>Prêmio do Sorteio</label>
          <input v-model="rafflePrize" type="text" />
        </div>
        <button @click="handleRaffle" class="btn btn-success self-end">
          <span class="btn-icon">🏆</span> Sortear Ganhador
        </button>
      </div>
    </section>

    <section class="admin-card">
      <div class="card-header">
        <span class="icon">🔍</span>
        <h3>Pesquisar Participantes</h3>
      </div>
      <p class="card-desc">Digite o nome ou email para buscar entre os cadastrados.</p>

      <div class="search-wrapper">
        <span class="search-icon">Q</span>
        <input v-model="searchText" type="text" placeholder="Digite o nome do participante..." />
      </div>
    </section>
  </div>
</template>

<style scoped>
.tab-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
  color: #105e36; /* Verde escuro igual imagem */
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
}
.card-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

/* Formulários */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group.full-width {
  grid-column: span 2;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
}

input {
  padding: 0.8rem;
  background-color: #f3f4f6; /* Fundo cinza do input */
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  outline: none;
  font-size: 0.95rem;
}

input:focus {
  border-color: #10b981;
  background-color: white;
}

/* Botões */
.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-success {
  background-color: #25d366;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-success:hover {
  opacity: 0.9;
}

.raffle-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end; /* Alinha botão com input */
}
.flex-grow {
  flex: 1;
}
.self-end {
  margin-bottom: 2px;
} /* Ajuste fino de alinhamento */

/* Pesquisa */
.search-wrapper {
  position: relative;
}
.search-wrapper input {
  width: 100%;
  padding-left: 2.5rem;
  box-sizing: border-box;
}
.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}
</style>
