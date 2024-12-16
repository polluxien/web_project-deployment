import express from "express";
import cors, { CorsOptions } from "cors";

/**
 * In app.ts aufrufen:
 * ```
 * configureCORS(app);
 * ```
 * (am besten gleich nach dem Erzeugen der app).
 * Das Paket 'cors' ist bereits installiert.
 */
export function configureCORS(app: express.Express) {
  const corsOptions: CorsOptions = {
    origin: [
      "http://localhost:3000",
      "http://frontend:3000",
      process.env.CORS_ORIGIN!,
    ].filter(Boolean), // Entfernt undefined/null Werte
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  console.log(`Exposed Corse: ${process.env.CORS_ORIGIN}`);
  app.use(cors(corsOptions));
  app.options("*", cors()); // enable pre-flight (request method "options") everywhere, you may want to specify that in detail in production
}
