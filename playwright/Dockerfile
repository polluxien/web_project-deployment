FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /tests

# Dependencies kopieren und installieren
COPY package*.json ./
RUN npm ci

# Playwright installieren
RUN npx playwright install --with-deps

# Alles kopieren
COPY . .
