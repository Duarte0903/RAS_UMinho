FROM node:19

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia os ficheiros de dependências e instala os pacotes necessários
COPY package*.json ./
RUN npm install

# Copia o código da aplicação para dentro da imagem
COPY . .

# Instala o Redis
#RUN apt-get update && apt-get install -y redis-server && apt-get clean

# Exponha a porta que a aplicação e o Redis irão usar
EXPOSE 7001 
#EXPOSE 7001 6999

# Comando para iniciar o Redis em segundo plano e depois iniciar a aplicação
#CMD ["sh", "-c", "redis-server --daemonize yes && npm start"]
CMD ["npm", "start"]
