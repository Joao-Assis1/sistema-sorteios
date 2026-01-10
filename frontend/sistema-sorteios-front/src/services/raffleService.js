import http from './http'

/**
 * Busca os últimos ganhadores (Dados públicos)
 * @returns {Promise<Array>}
 */
export const getRecentWinners = async () => {
  // Ajuste a rota '/public/winners' conforme seu backend real
  const { data } = await http.get('/public/winners')
  return data
}
