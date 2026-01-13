# Imagem base
FROM node:22-alpine

# Instala servidor web simples
RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# A porta padrão do servidor de desenvolvimento do Vue (Vite) é 5173.
EXPOSE 5173

# Inicia o servidor de desenvolvimento que suporta Hot Module Replacement (HMR).
CMD ["npm", "run", "dev", "--", "--host"]