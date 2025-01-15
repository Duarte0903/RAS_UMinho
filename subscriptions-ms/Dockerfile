FROM node:19

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia os ficheiros de dependências e instala os pacotes necessários
COPY package*.json ./
RUN npm install

# Copia o código da aplicação para dentro da imagem
COPY . .

# Copia o wait-for-it para o container
COPY wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

# Exponha a porta que a aplicação irá usar
EXPOSE 5002

# Comando para iniciar a aplicação
CMD ["wait-for-it", "mongodb-subscriptions:27017", "--", "npm", "start"]
