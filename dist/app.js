"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const supabase_js_1 = require("@supabase/supabase-js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "***clé présente***" : "MANQUANTE");
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// GET toutes les fleurs
app.get("/flowers", async (req, res) => {
    try {
        const { data, error } = await supabase.from("flowers").select("*");
        if (error)
            throw error;
        res.status(200).json(data);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// POST une nouvelle fleur
app.post("/flowers", async (req, res) => {
    const { name, color } = req.body;
    if (!name)
        return res.status(400).json({ error: "Name is required" });
    try {
        const { data, error } = await supabase
            .from("flowers")
            .insert([{ name, color }])
            .select();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.listen(3000, () => console.log("Server running on http://0.0.0.0:3000"));
