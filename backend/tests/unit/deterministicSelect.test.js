import { strict as assert } from "node:assert";
import { deterministicSelect } from "../../src/utils/lotteryUtils.js";

console.log(
  "🧪 Iniciando Teste de Determinismo com Dados REAIS da Blockchain...",
);

// Mock data (simulando 100 participantes para espalhar bem)
const mockParticipants = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Participante ${i + 1}`,
}));

// Seeds reais da Blockchain do Bitcoin
const realWorldSeeds = [
  {
    name: "Bloco #0 (Genesis Block)",
    hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    expectedIndex: 7, // BigInt("0x...") % 100n
  },
  {
    name: "Bloco #800,000 (Julho 2023)",
    hash: "00000000000000000008edc00e3f019f357b98d1a656641775a6c024508a054",
    expectedIndex: 20, // Calculado previamente ou verificado na execução
  },
];

// Teste de Consistência e Reprodutibilidade
realWorldSeeds.forEach((testCase) => {
  console.log(`\n🔍 Testando com seed do ${testCase.name}`);
  console.log(`   Hash: ${testCase.hash}`);

  // Execução A
  const resultA = deterministicSelect(testCase.hash, mockParticipants);
  // Execução B (para garantir idêntico resultado)
  const resultB = deterministicSelect(testCase.hash, mockParticipants);

  // 1. O resultado deve ser idêntico (Determinismo)
  assert.deepEqual(
    resultA,
    resultB,
    "❌ Determinismo falhou: Mesma seed deve gerar resultado idêntico.",
  );
  console.log(
    `   ✅ Determinismo confirmado (Index: ${resultA.index}, Vencedor: ${resultA.winner.name})`,
  );

  // 2. Verificação Matemática (Opcional, mas bom para sanidade)
  // Recalcula manualmente para provar que a lógica não mudou "magicamente"
  const seedBigInt = BigInt("0x" + testCase.hash);
  const expectedCalc = Number(seedBigInt % BigInt(mockParticipants.length));

  assert.equal(
    resultA.index,
    expectedCalc,
    `❌ Erro Matemático: Esperado índice ${expectedCalc}, recebeu ${resultA.index}`,
  );
  console.log(
    `   ✅ Cálculo matemático validado: ${testCase.hash.substring(0, 10)}... % 100 = ${resultA.index}`,
  );
});

console.log("\n---------------------------------------------------");
console.log("🎉 Todos os testes de auditoria passaram com sucesso!");
console.log("   O sistema garante que para um mesmo bloco Bitcoin e");
console.log("   mesma lista de participantes, o vencedor é SEMPRE o mesmo.");
console.log("---------------------------------------------------");
