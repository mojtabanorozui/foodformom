import { MongoClient } from "mongodb";

let db;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to your .env file.");
  }

  const client = new MongoClient(uri);
  await client.connect();

  db = client.db(process.env.MONGODB_DB ?? "foodformom");

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("sessions").createIndex({ token: 1 }, { unique: true });
  await db.collection("user_recipes").createIndex({ createdAt: -1 });
  await db.collection("people_recipes").createIndex({ createdAt: -1 });

  console.log(`Connected to MongoDB (${db.databaseName})`);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected. Call connectDb() first.");
  }
  return db;
}
