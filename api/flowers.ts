import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET /api/flowers
  if (req.method === "GET") {
    const { data, error } = await supabase.from("flowers").select("*");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  // POST /api/flowers
  if (req.method === "POST") {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("flowers")
      .insert([{ name, color }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
