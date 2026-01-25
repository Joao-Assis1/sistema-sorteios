export function deterministicSelect(seedValue, participants) {
  // Converte hash hexadecimal para BigInt
  const seed = BigInt("0x" + seedValue);
  const total = BigInt(participants.length);

  // Realiza o módulo para encontrar o índice vencedor
  const winnerIndex = Number(seed % total);

  return {
    winner: participants[winnerIndex],
    index: winnerIndex,
  };
}
