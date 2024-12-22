FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /playwright

# Package files kopieren
COPY package*.json ./

#RUN npm install -g @playwright/test@1.41.0

# Installiere Dependencies
RUN npm ci --no-audit --no-fund

# Nur Firefox installieren
RUN npx playwright install firefox

# Rest der Files kopieren
COPY . .

# Test Command
CMD ["npx", "playwright", "test", "--headed=false"]
