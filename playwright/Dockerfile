FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /playwright

# Package files kopieren
COPY . .


#RUN npm install -g @playwright/test@1.41.0

# Installiere Dependencies
RUN npm ci --no-audit --no-fund

# Nur Firefox installieren
RUN npx playwright install firefox

# Test Command
CMD ["npx", "playwright", "test"]
