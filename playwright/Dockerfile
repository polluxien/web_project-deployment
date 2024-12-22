FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /playwright

# Erst package.json und package-lock.json kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm install

# Dann den Rest der Files kopieren
COPY . .

# Browser installieren
RUN npx playwright install firefox

# Für Debug-Zwecke: Verzeichnisinhalt anzeigen und Versionen prüfen
RUN ls -la && \
    node --version && \
    npm --version && \
    npx playwright --version

# Test ausführen
ENTRYPOINT ["npx", "playwright", "test"]