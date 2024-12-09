# Phase 1: Build-Phase mit Node.js
FROM node:20 AS build

# Arbeitsverzeichnis setzen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren und Anwendung bauen
COPY . .
RUN npm run build

# Phase 2: Bereitstellungsphase mit Nginx
FROM nginx:alpine

# Kopiere den Build aus der Node.js-Phase
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exponieren des Ports
EXPOSE 80

# Standard-Nginx-Startbefehl
CMD ["nginx", "-g", "daemon off;"]
