# Phase 1: Build-Phase mit Node.js
FROM node:16

# Installiere systemweite Abhängigkeiten für Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    && rm -rf /var/lib/apt/lists/*

# Arbeitsverzeichnis einrichten
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Anwendungscode kopieren
COPY . .

# Playwright-Browser installieren
RUN npx playwright install

# Startbefehl für Tests
CMD ["npm", "test"]