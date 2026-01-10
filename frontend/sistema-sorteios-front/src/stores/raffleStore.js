import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRecentWinners } from '@/services/raffleService'

export const useRaffleStore = defineStore('raffle', () => {
  // --- State ---
  const winners = ref([])
  const isLoadingWinners = ref(false)
  const error = ref(null)

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
    checkStatus,
    fetchWinners,
  }
})
