

import "server-only";
import dns from "node:dns";
import { MongoClient } from "mongodb";

// Use Cloudflare DNS for MongoDB SRV lookup
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const uri = process.env.MONGO_DB_URL;

if (!uri) {
  throw new Error("MONGO_DB_URL is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export { mongoClient };

export const db = mongoClient.db(
  process.env.MONGO_DB || "bazardor"
);
