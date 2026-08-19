import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { connectDb, getDb } from "./db.mjs";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

async function authMiddleware(req, _res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }

  const session = await getDb()
    .collection("sessions")
    .findOne({ token, expiresAt: { $gt: Date.now() } });

  if (!session) {
    req.user = null;
    return next();
  }

  const user = await getDb()
    .collection("users")
    .findOne(
      { id: session.userId },
      { projection: { _id: 0, id: 1, email: 1, displayName: 1, createdAt: 1 } },
    );

  req.user = user ?? null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.use(authMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/signup", async (req, res) => {
  const email = String(req.body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password ?? "");
  const displayName = String(req.body.displayName ?? "").trim();

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "authErrorRequired" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "authErrorPassword" });
  }

  const existing = await getDb().collection("users").findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "authErrorEmailTaken" });
  }

  const user = {
    id: newId("user"),
    email,
    displayName,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  };

  await getDb().collection("users").insertOne(user);

  const token = newId("sess");
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  await getDb().collection("sessions").insertOne({ token, userId: user.id, expiresAt });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password ?? "");

  const row = await getDb().collection("users").findOne({ email });

  if (!row || row.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "authErrorInvalid" });
  }

  const token = newId("sess");
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  await getDb().collection("sessions").insertOne({ token, userId: row.id, expiresAt });

  res.json({
    token,
    user: {
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      createdAt: row.createdAt,
    },
  });
});

app.get("/api/auth/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ user: req.user });
});

app.post("/api/auth/logout", async (req, res) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    await getDb().collection("sessions").deleteOne({ token });
  }
  res.json({ ok: true });
});

app.get("/api/recipes/user", async (_req, res) => {
  const rows = await getDb()
    .collection("user_recipes")
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(rows);
});

app.post("/api/recipes/user", requireAuth, async (req, res) => {
  const recipe = {
    id: newId("ur"),
    userId: req.user.id,
    foodId: String(req.body.foodId ?? ""),
    foodName: String(req.body.foodName ?? ""),
    authorName: String(req.body.authorName ?? req.user.displayName),
    title: String(req.body.title ?? ""),
    ingredients: req.body.ingredients ?? [],
    steps: req.body.steps ?? [],
    note: req.body.note ? String(req.body.note) : undefined,
    createdAt: Date.now(),
  };

  if (!recipe.foodId || !recipe.title) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await getDb().collection("user_recipes").insertOne(recipe);

  res.status(201).json(recipe);
});

app.delete("/api/recipes/user/:id", requireAuth, async (req, res) => {
  const row = await getDb().collection("user_recipes").findOne({ id: req.params.id });
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  await getDb().collection("user_recipes").deleteOne({ id: req.params.id });
  res.json({ ok: true });
});

app.get("/api/recipes/people", async (_req, res) => {
  const rows = await getDb()
    .collection("people_recipes")
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(rows);
});

app.post("/api/recipes/people", requireAuth, async (req, res) => {
  const recipe = {
    id: newId("pr"),
    userId: req.user.id,
    authorName: String(req.body.authorName ?? req.user.displayName),
    name: String(req.body.name ?? ""),
    emoji: req.body.emoji ? String(req.body.emoji) : undefined,
    difficulty: String(req.body.difficulty ?? "Normal"),
    category: req.body.category ? String(req.body.category) : undefined,
    ingredients: req.body.ingredients ?? [],
    steps: req.body.steps ?? [],
    note: req.body.note ? String(req.body.note) : undefined,
    createdAt: Date.now(),
  };

  if (!recipe.name) {
    return res.status(400).json({ error: "Missing name" });
  }

  await getDb().collection("people_recipes").insertOne(recipe);

  res.status(201).json(recipe);
});

app.delete("/api/recipes/people/:id", requireAuth, async (req, res) => {
  const row = await getDb().collection("people_recipes").findOne({ id: req.params.id });
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  await getDb().collection("people_recipes").deleteOne({ id: req.params.id });
  res.json({ ok: true });
});

await connectDb();

app.listen(PORT, () => {
  console.log(`FoodForMom API running on http://localhost:${PORT}`);
});
