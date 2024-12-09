# Node.js-Image verwenden
FROM node:20

# Arbeitsverzeichnis setzen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Anwendungscode kopieren
COPY . .

# Exponieren des Ports
EXPOSE $PORT

# Start der Anwendung
CMD ["npm", "start"]
