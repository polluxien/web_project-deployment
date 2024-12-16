FROM node:20
WORKDIR /app

# WICHTIG: Ändern Sie npm ci
RUN npm install -g npm@latest && \
    npm cache clean --force

# Korrektur für Entwicklungsumgebung
COPY package*.json ./
RUN npm install --silent 

COPY . .
EXPOSE 3000
CMD ["npm", "start"]