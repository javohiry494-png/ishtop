const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}
function readPosts() {
  ensureStore();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}
function writePosts(posts) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf8");
}

// Verify Telegram Mini App initData using the bot token.
// Posting is disabled unless a valid Telegram initData is supplied.
function verifyTelegramInitData(initData) {
  if (!BOT_TOKEN || !initData || typeof initData !== "string") return false;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;
  params.delete("hash");

  const pairs = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);
  const dataCheckString = pairs.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();
  const calculated = crypto.createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const a = Buffer.from(calculated, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const authDate = Number(params.get("auth_date") || 0);
  const now = Math.floor(Date.now() / 1000);
  return authDate > 0 && now - authDate <= 86400 && authDate <= now + 60;
}

function cleanText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

app.get("/api/posts", (_req, res) => {
  res.json(readPosts());
});

app.post("/api/posts", (req, res) => {
  const body = req.body || {};
  if (!verifyTelegramInitData(body.initData)) {
    return res.status(401).json({
      error: "Telegram orqali ochilgan haqiqiy Web App sessiyasi talab qilinadi."
    });
  }

  const raw = body.post || {};
  const post = {
    id: crypto.randomUUID(),
    k: Number(raw.k) === 1 ? 1 : 0,
    t: cleanText(raw.t, 60),
    n: cleanText(raw.n, 40),
    c: cleanText(raw.c, 40),
    g: cleanText(raw.g, 30),
    p: raw.p === "Kunlik" ? "Kunlik" : "Oylik",
    s: cleanText(raw.s, 30),
    ct: cleanText(raw.ct, 40),
    a: cleanText(raw.a, 140),
    createdAt: new Date().toISOString()
  };

  if (!post.t || !post.n || !post.s) {
    return res.status(400).json({ error: "Kasb, ism/kompaniya va maosh majburiy." });
  }

  const posts = readPosts();
  posts.unshift(post);
  writePosts(posts.slice(0, 1000));
  res.status(201).json({ ok: true, post });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`IshTop server running on port ${PORT}`);
});
