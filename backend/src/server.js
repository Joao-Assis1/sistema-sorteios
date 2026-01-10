import "dotenv/config"; // Carrega variáveis .env imediatamente
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} (ES Modules)`);
});
