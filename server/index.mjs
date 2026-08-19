import express from "express";
import cors from "cors";
import crypto from "crypto";
import db from "./db.mjs";

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

function parseJsonArray(value) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }

  const row = db
    .prepare(
      `SELECT u.id, u.email, u.display_name AS displayName, u.created_at AS createdAt
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, Date.now());

  req.user = row ?? null;
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

app.post("/api/auth/signup", (req, res) => {
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

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
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

  db.prepare(
    "INSERT INTO users (id, email, display_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(user.id, user.email, user.displayName, user.passwordHash, user.createdAt);

  const token = newId("sess");
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    user.id,
    expiresAt,
  );

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

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password ?? "");

  const row = db
    .prepare(
      "SELECT id, email, display_name AS displayName, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = ?",
    )
    .get(email);

  if (!row || row.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "authErrorInvalid" });
  }

  const token = newId("sess");
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    row.id,
    expiresAt,
  );

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

app.post("/api/auth/logout", (req, res) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  res.json({ ok: true });
});

app.get("/api/recipes/user", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, user_id AS userId, food_id AS foodId, food_name AS foodName,
              author_name AS authorName, title, ingredients, steps, note, created_at AS createdAt
       FROM user_recipes ORDER BY created_at DESC`,
    )
    .all();

  res.json(
    rows.map((row) => ({
      ...row,
      ingredients: parseJsonArray(row.ingredients),
      steps: parseJsonArray(row.steps),
    })),
  );
});

app.post("/api/recipes/user", requireAuth, (req, res) => {
  const recipe = {
    id: newId("ur"),
    userId: req.user.id,
    foodId: String(req.body.foodId ?? ""),
    foodName: String(req.body.foodName ?? ""),
    authorName: String(req.body.authorName ?? req.user.displayName),
    title: String(req.body.title ?? ""),
    ingredients: JSON.stringify(req.body.ingredients ?? []),
    steps: JSON.stringify(req.body.steps ?? []),
    note: req.body.note ? String(req.body.note) : null,
    createdAt: Date.now(),
  };

  if (!recipe.foodId || !recipe.title) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.prepare(
    `INSERT INTO user_recipes
     (id, user_id, food_id, food_name, author_name, title, ingredients, steps, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    recipe.id,
    recipe.userId,
    recipe.foodId,
    recipe.foodName,
    recipe.authorName,
    recipe.title,
    recipe.ingredients,
    recipe.steps,
    recipe.note,
    recipe.createdAt,
  );

  res.status(201).json({
    id: recipe.id,
    userId: recipe.userId,
    foodId: recipe.foodId,
    foodName: recipe.foodName,
    authorName: recipe.authorName,
    title: recipe.title,
    ingredients: parseJsonArray(recipe.ingredients),
    steps: parseJsonArray(recipe.steps),
    note: recipe.note ?? undefined,
    createdAt: recipe.createdAt,
  });
});

app.delete("/api/recipes/user/:id", requireAuth, (req, res) => {
  const row = db
    .prepare("SELECT user_id FROM user_recipes WHERE id = ?")
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  db.prepare("DELETE FROM user_recipes WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.get("/api/recipes/people", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, user_id AS userId, author_name AS authorName, name, emoji,
              difficulty, category, ingredients, steps, note, created_at AS createdAt
       FROM people_recipes ORDER BY created_at DESC`,
    )
    .all();

  res.json(
    rows.map((row) => ({
      ...row,
      ingredients: parseJsonArray(row.ingredients),
      steps: parseJsonArray(row.steps),
      category: row.category ?? undefined,
      emoji: row.emoji ?? undefined,
      note: row.note ?? undefined,
    })),
  );
});

app.post("/api/recipes/people", requireAuth, (req, res) => {
  const recipe = {
    id: newId("pr"),
    userId: req.user.id,
    authorName: String(req.body.authorName ?? req.user.displayName),
    name: String(req.body.name ?? ""),
    emoji: req.body.emoji ? String(req.body.emoji) : null,
    difficulty: String(req.body.difficulty ?? "Normal"),
    category: req.body.category ? String(req.body.category) : null,
    ingredients: JSON.stringify(req.body.ingredients ?? []),
    steps: JSON.stringify(req.body.steps ?? []),
    note: req.body.note ? String(req.body.note) : null,
    createdAt: Date.now(),
  };

  if (!recipe.name) {
    return res.status(400).json({ error: "Missing name" });
  }

  db.prepare(
    `INSERT INTO people_recipes
     (id, user_id, author_name, name, emoji, difficulty, category, ingredients, steps, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    recipe.id,
    recipe.userId,
    recipe.authorName,
    recipe.name,
    recipe.emoji,
    recipe.difficulty,
    recipe.category,
    recipe.ingredients,
    recipe.steps,
    recipe.note,
    recipe.createdAt,
  );

  res.status(201).json({
    id: recipe.id,
    userId: recipe.userId,
    authorName: recipe.authorName,
    name: recipe.name,
    emoji: recipe.emoji ?? undefined,
    difficulty: recipe.difficulty,
    category: recipe.category ?? undefined,
    ingredients: parseJsonArray(recipe.ingredients),
    steps: parseJsonArray(recipe.steps),
    note: recipe.note ?? undefined,
    createdAt: recipe.createdAt,
  });
});

app.delete("/api/recipes/people/:id", requireAuth, (req, res) => {
  const row = db
    .prepare("SELECT user_id FROM people_recipes WHERE id = ?")
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  db.prepare("DELETE FROM people_recipes WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`FoodForMom API running on http://localhost:${PORT}`);
});
