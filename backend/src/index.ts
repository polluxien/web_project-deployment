/* istanbul ignore file */

import dotenv from "dotenv";
dotenv.config(); // read ".env"

import { readFile } from "fs/promises";
import http from "http";
import https from "https";
import mongoose from "mongoose";
import app from "./app";
import { logger } from "./logger";
import { prefillDB } from "./prefill";

async function setup() {
  let mongodURI = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URL;
  const isDocker = process.env.IS_DOCKER === "true"; // Überprüfen, ob Docker läuft
  /*
  Ich lass jetzt einfach beide Ports offen
  const useSSL = process.env.USE_SSL === "true";
  */
  const httpsPort = parseInt(process.env.HTTPS_PORT!);
  const host = process.env.HOST || "localhost";

  // Wenn Docker läuft, setze den MongoDB URI aus der Umgebungsvariable
  if (isDocker) {
    logger.info(`Docker is running`);
    mongodURI = process.env.MONGODB_URL || mongodURI;
  }

  if (!mongodURI) {
    logger.error(
      `Cannot start, no database configured. Set environment variable DB_CONNECTION_STRING. Use "memory" for MongoMemoryServer`
    );
    process.exit(1);
  }

  if (mongodURI === "memory") {
    logger.info("Start MongoMemoryServer");
    const MMS = await import("mongodb-memory-server");
    const mongo = await MMS.MongoMemoryServer.create();
    mongodURI = mongo.getUri(); // Verbindungs-URI für MongoMemoryServer
  }

  logger.info(`Connect to mongoDB at ${mongodURI}`);
  await mongoose.connect(mongodURI); // Verbindung zu MongoDB herstellen

  // Datenbank mit Beispiel-Daten befüllen
  if (process.env.DB_PREFILL === "true") {
    await prefillDB();
  }

  // HTTPS-Server starten, wenn SSL aktiviert ist
  // if (useSSL) {
  //Jetzt sind beider ports offen
  const [privateSSLKey, publicSSLCert] = await Promise.all([
    readFile(process.env.SSL_KEY_FILE!),
    readFile(process.env.SSL_CRT_FILE!),
  ]);

  const httpsServer = https.createServer(
    { key: privateSSLKey, cert: publicSSLCert },
    app
  );

  httpsServer.listen(httpsPort, () => {
    logger.info(`Listening for HTTPS at https://${host}:${httpsPort}`);
  });
  // }

  const port = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 80; // Standard-Port 3000 für HTTP
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    logger.info(`Listening for HTTP at http://${host}:${port}`);
  });
}

setup();
