FROM node:20-slim

# Wechseln zu root für Systeminstallationen
USER root

WORKDIR /usr/src/app

# Erweiterte Systemabhängigkeiten
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    libcurl4 \  
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# npm global updaten
RUN npm install -g npm@latest && \
    npm cache clean --force

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install --silent 

# Gesamten Anwendungscode kopieren
COPY . .

# TypeScript Build 
RUN npm run build || true

# Benutzerberechtigungen setzen
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 80

# Start-Kommando
CMD ["npm", "start"]