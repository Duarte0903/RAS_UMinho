FROM node:18-alpine
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node . .
USER node
EXPOSE 5005
CMD ["npm", "run", "dev"]
