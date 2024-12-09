import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Starts the MongoMemoryServer with a specific MongoDB version.
 */
export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: "7.0.3", // Stelle sicher, dass dies die gewünschte Version ist
    },
  });
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));
}
