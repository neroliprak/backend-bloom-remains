require("dotenv").config();

import { createClient } from "@supabase/supabase-js";
import express from "express";
import cors from "cors";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL:", supabaseUrl);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  supabaseKey ? "***clé présente***" : "MANQUANTE"
);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(express.json());

// GET toutes les fleurs
app.get("/flowers", async (req, res) => {
  try {
    const { data, error } = await supabase.from("flowers").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST une nouvelle fleur
app.post("/flowers", async (req, res) => {
  const { name, color } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const { data, error } = await supabase
      .from("flowers")
      .insert([{ name, color }])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
app.listen(3000, () => console.log("Server running on http://0.0.0.0:3000"));
