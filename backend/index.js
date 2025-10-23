import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

app.get("/", (req, res) => {
  res.send("✅ Backend running !");
});

app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now;");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend started on port ${PORT}`));

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "you@example.com",
    password: "yourpassword",
  });
});

app.post("/api/admin/bootstrap", async (req, res) => {
  const token = req.headers["x-setup-token"];
  if (
    !process.env.ADMIN_SETUP_TOKEN ||
    token !== process.env.ADMIN_SETUP_TOKEN
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  // 1) Crée l'utilisateur s'il n'existe pas
  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  let userId = created?.user?.id;

  // 2) Si déjà existant, récupère son id
  if (!userId && createError) {
    const { data: list, error: listError } =
      await supabase.auth.admin.listUsers();
    if (listError) return res.status(500).json({ error: listError.message });
    const existing = list.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (!existing) return res.status(500).json({ error: createError.message });
    userId = existing.id;
  }

  // 3) Attribue le rôle admin dans app_metadata (fiable pour RLS/politiques)
  const { data: updated, error: updateError } =
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: "admin" },
    });
  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.json({ ok: true, userId });
});
