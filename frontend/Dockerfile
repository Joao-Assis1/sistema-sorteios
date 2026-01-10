# Imagem base
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# A porta padrão do servidor de desenvolvimento do Vue (Vite ou Vue CLI) geralmente é 8080 ou 5173.
# Ajuste conforme seu package.json.
EXPOSE 8080

# Inicia o servidor de desenvolvimento que suporta Hot Module Replacement (HMR).
CMD ["npm", "run", "serve"]