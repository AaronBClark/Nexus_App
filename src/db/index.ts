import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/nexus.sqlite";

function ensureDir(p: string) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(DB_PATH);

export const db = new Database(DB_PATH);

// Run schema on startup
const schemaSql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
db.exec(schemaSql);