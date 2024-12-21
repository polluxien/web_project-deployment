FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /tests

# Debug: Verzeichnis anzeigen
RUN pwd && ls -la

COPY package*.json ./
RUN npm ci
RUN npx playwright install firefox

# Debug: Prüfen ob Installation erfolgreich war
RUN which npx
RUN ls -la node_modules/.bin/
RUN npm ls @playwright/test

COPY . .