# Dockerfile.playwright
FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /tests

# Dependencies kopieren und installieren
COPY package*.json ./
RUN npm ci

# Playwright installieren
RUN npx playwright install --with-deps

# Test-Files kopieren
COPY playwright ./playwright
COPY playwright.config.ts ./

# Tests ausführen
CMD ["npm", "test"]