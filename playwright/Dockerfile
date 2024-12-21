FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /tests

# Package files kopieren
COPY package.json package-lock.json ./

# Clean install mit explizitem Registry
RUN npm ci --registry=https://registry.npmjs.org/

# Nur Firefox installieren
RUN npx playwright install firefox

# Rest der Files kopieren
COPY . .

# Prüfen der Installation
RUN npm list

# Test Command
CMD ["npm", "run", "test"]