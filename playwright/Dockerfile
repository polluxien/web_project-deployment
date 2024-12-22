FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /tests

# Package files kopieren
COPY package*.json ./

# Installiere Dependencies
RUN npm ci --no-audit --no-fund

# Nur Firefox installieren
RUN npx playwright install firefox

# Rest der Files kopieren
COPY . .

# Prüfen der Installation
RUN npm list

# Test Command
ENTRYPOINT ["npx", "playwright", "test"]