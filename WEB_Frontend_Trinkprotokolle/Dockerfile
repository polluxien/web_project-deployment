# Node.js-Image verwenden
FROM node:20

# Arbeitsverzeichnis setzen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Anwendung bauen
RUN npm install
COPY . .
RUN npm run build

# Nginx-Image für den fertigen Build verwenden
FROM nginx:alpine

# Build in den Nginx-Webserver kopieren
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Exponieren des Ports
EXPOSE 3000

# Start des Nginx-Servers
CMD ["npm", "start"]