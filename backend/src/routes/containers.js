import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all
router.get("/", (req, res) => {
  db.all("SELECT * FROM containers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create
router.post("/", (req, res) => {
  const { name, code, length_mm, width_mm, height_mm, max_weight_kg } = req.body;
  db.run(
    `INSERT INTO containers (name, code, length_mm, width_mm, height_mm, max_weight_kg)
     VALUES (?,?,?,?,?,?)`,
    [name, code, length_mm, width_mm, height_mm, max_weight_kg],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

export default router;
