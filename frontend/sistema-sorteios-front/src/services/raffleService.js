import http from './http'

/**
 * Busca os últimos ganhadores (Dados públicos)
 * @returns {Promise<Array>}
 */
export const getRecentWinners = async () => {
  // Ajuste a rota '/public/winners' conforme seu backend real
  const { data } = await http.get('/public/winners')
  resolve([
    {
      id: 1,
      rank: '1º Lugar',
      name: 'Joao Paulo',
      email: 'joao@...',
      phone: '1199...',
      prize: 'Camisa Oficial',
      date: '03/09/2025',
      time: '10:10:56',
    },
    {
      id: 2,
      rank: '1º Lugar',
      name: 'Moises Pereira',
      email: 'moises@...',
      phone: '1199...',
      prize: 'Camisa Retrô',
      date: '01/09/2025',
      time: '22:07:34',
    },
    {
      id: 3,
      rank: '2º Lugar',
      name: 'Joao Paulo',
      email: 'joao@...',
      phone: '1199...',
      prize: 'Boné Oficial',
      date: '01/09/2025',
      time: '20:46:13',
    },
    {
      id: 4,
      rank: '1º Lugar',
      name: 'Mateus',
      email: 'mateus@...',
      phone: '1199...',
      prize: 'Voucher R$100',
      date: '01/09/2025',
      time: '20:41:09',
    },
    {
      id: 5,
      rank: '3º Lugar',
      name: 'Joao Paulo',
      email: 'joao@...',
      phone: '1199...',
      prize: 'Chaveiro',
      date: '01/09/2025',
      time: '19:42:31',
    },
  ])
  return data
}
