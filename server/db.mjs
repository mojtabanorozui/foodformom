import { MongoClient } from "mongodb";

let db;
let connected = false;

export function isDbConnected() {
  return connected;
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to your .env file.");
    return null;
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();

    db = client.db(process.env.MONGODB_DB ?? "foodformom");

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ token: 1 }, { unique: true });
    await db.collection("user_recipes").createIndex({ createdAt: -1 });
    await db.collection("people_recipes").createIndex({ createdAt: -1 });

    connected = true;
    console.log(`Connected to MongoDB (${db.databaseName})`);
    return db;
  } catch (err) {
    connected = false;
    console.error("MongoDB connection failed:", err.message);
    console.error("Check MONGODB_URI in your .env file (password, IP whitelist on Atlas).");
    return null;
  }
}

export function getDb() {
  if (!db || !connected) {
    throw new Error("Database not connected");
  }
  return db;
}
