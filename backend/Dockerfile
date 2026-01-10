# Define a imagem base. Usamos 'alpine' por ser uma versão Linux extremamente leve e segura.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia APENAS os arquivos de definição de dependências primeiro.
# Isso é crucial para o cache do Docker: se você mudar o código mas não as dependências,
# o Docker não precisará rodar 'npm install' novamente, acelerando o build.
COPY package*.json ./

# Instala as dependências.
RUN npm install

# Copia o restante do código fonte para dentro do contêiner.
COPY . .

# Expõe a porta que a aplicação usa (documentação).
EXPOSE 3000

# Comando para iniciar a aplicação em modo de desenvolvimento (com nodemon, por exemplo).
CMD ["npm", "run", "dev"]