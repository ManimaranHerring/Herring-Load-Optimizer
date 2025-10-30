import express from "express";
import db from "../db.js";

const router = express.Router();

// list shipments
router.get("/", (req, res) => {
  db.all("SELECT * FROM shipments ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// create shipment
router.post("/", (req, res) => {
  const { customer_name, origin, destination, stop_sequence, notes } = req.body;
  db.run(
    `INSERT INTO shipments (customer_name, origin, destination, stop_sequence, notes)
     VALUES (?,?,?,?,?)`,
    [customer_name, origin, destination, JSON.stringify(stop_sequence || []), notes],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// get items of shipment
router.get("/:id/items", (req, res) => {
  db.all(
    "SELECT * FROM shipment_items WHERE shipment_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// add item to shipment
router.post("/:id/items", (req, res) => {
  const { sku, length_mm, width_mm, height_mm, weight_kg, qty, group_code, fragile, top_only } =
    req.body;
  db.run(
    `INSERT INTO shipment_items
     (shipment_id, sku, length_mm, width_mm, height_mm, weight_kg, qty, group_code, fragile, top_only)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      req.params.id,
      sku,
      length_mm,
      width_mm,
      height_mm,
      weight_kg,
      qty || 1,
      group_code || null,
      fragile ? 1 : 0,
      top_only ? 1 : 0
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

export default router;
