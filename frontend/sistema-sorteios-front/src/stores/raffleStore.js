import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRecentWinners } from '@/services/raffleService'

export const useRaffleStore = defineStore('raffle', () => {
  // --- State ---
  const winners = ref([])
  const isLoadingWinners = ref(false)
  const error = ref(null)

  // 2. Dados Admin (Estatísticas - O que estava faltando)
  const stats = ref({
    participants: 6, // Baseado na imagem 2
    rafflesCount: 6, // Baseado na imagem 2
    lastRaffleDate: '03/09/2025', // Baseado na imagem 2
  })

  // --- Actions ---

  // Verifica status do participante (Simulado por enquanto)
  function checkStatus(email) {
    console.log(`Verificando status para: ${email}`)
    // Futura integração com API
  }

  // Busca ganhadores reais do backend
  async function fetchWinners() {
    isLoadingWinners.value = true
    error.value = null

    try {
      const data = await getRecentWinners()
      winners.value = data
    } catch (err) {
      console.error(err)
      error.value = 'Não foi possível carregar a lista de ganhadores.'
    } finally {
      isLoadingWinners.value = false
    }
  }

  return {
    winners,
    isLoadingWinners,
    error,
    stats,
    checkStatus,
    fetchWinners,
  }
})
