import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "data.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // containers
  db.run(`
    CREATE TABLE IF NOT EXISTS containers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      code TEXT,
      length_mm INTEGER,
      width_mm INTEGER,
      height_mm INTEGER,
      max_weight_kg REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // shipments
  db.run(`
    CREATE TABLE IF NOT EXISTS shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      origin TEXT,
      destination TEXT,
      stop_sequence TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // shipment items
  db.run(`
    CREATE TABLE IF NOT EXISTS shipment_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shipment_id INTEGER,
      sku TEXT,
      length_mm INTEGER,
      width_mm INTEGER,
      height_mm INTEGER,
      weight_kg REAL,
      qty INTEGER DEFAULT 1,
      group_code TEXT,
      fragile INTEGER DEFAULT 0,
      top_only INTEGER DEFAULT 0,
      orientation_allowed TEXT,
      FOREIGN KEY (shipment_id) REFERENCES shipments(id)
    );
  `);

  // load plans
  db.run(`
    CREATE TABLE IF NOT EXISTS load_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shipment_id INTEGER,
      score REAL,
      total_containers INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shipment_id) REFERENCES shipments(id)
    );
  `);

  // load plan items
  db.run(`
    CREATE TABLE IF NOT EXISTS load_plan_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER,
      container_code TEXT,
      shipment_item_id INTEGER,
      x REAL,
      y REAL,
      z REAL,
      rotation TEXT,
      level INTEGER,
      FOREIGN KEY (plan_id) REFERENCES load_plans(id),
      FOREIGN KEY (shipment_item_id) REFERENCES shipment_items(id)
    );
  `);
});

export default db;
