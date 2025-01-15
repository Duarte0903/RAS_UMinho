FROM node:19

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia os ficheiros de dependências e instala os pacotes necessários
COPY package*.json ./
RUN npm install

# Copia o código da aplicação para dentro da imagem
COPY . .

# Exponha a porta que a aplicação irá usar
EXPOSE 5002

# Comando para iniciar a aplicação
CMD ["npm", "start"]
