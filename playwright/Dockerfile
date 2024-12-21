FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /tests

# Package files kopieren
COPY package.json package-lock.json ./

# Installiere Dependencies
RUN npm ci

# Nur Firefox installieren
RUN npx playwright install firefox

# Rest der Files kopieren
COPY . .

# Prüfen der Installation
RUN npm list

# Test Command
CMD ["npx", "run", "test"]