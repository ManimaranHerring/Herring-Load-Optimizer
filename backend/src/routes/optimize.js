import express from "express";
import db from "../db.js";
import { runSimpleOptimization } from "../services/optimizer.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { shipment_id, allowed_container_types } = req.body;

  // get shipment
  db.get("SELECT * FROM shipments WHERE id = ?", [shipment_id], (err, shipment) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });

    // get items
    db.all("SELECT * FROM shipment_items WHERE shipment_id = ?", [shipment_id], (err2, items) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // get containers (filter if needed)
      const query =
        allowed_container_types && allowed_container_types.length
          ? `SELECT * FROM containers WHERE code IN (${allowed_container_types
              .map(() => "?")
              .join(",")})`
          : "SELECT * FROM containers";
      const params = allowed_container_types && allowed_container_types.length
        ? allowed_container_types
        : [];

      db.all(query, params, (err3, containers) => {
        if (err3) return res.status(500).json({ error: err3.message });

        const result = runSimpleOptimization({ shipment, items, containers });

        if (result.error) return res.status(400).json(result);

        // save plan
        db.run(
          `INSERT INTO load_plans (shipment_id, score, total_containers)
           VALUES (?,?,?)`,
          [shipment_id, result.utilization, 1],
          function (err4) {
            if (err4) return res.status(500).json({ error: err4.message });

            const planId = this.lastID;

            const stmt = db.prepare(
              `INSERT INTO load_plan_items
              (plan_id, container_code, shipment_item_id, x, y, z, rotation, level)
               VALUES (?,?,?,?,?,?,?,?)`
            );

            result.placed.forEach((p) => {
              stmt.run([
                planId,
                result.container_used,
                p.shipment_item_id,
                p.x,
                p.y,
                p.z,
                p.rotation,
                p.level
              ]);
            });

            stmt.finalize();

            res.json({
              plan_id: planId,
              container: result.container_used,
              utilization: result.utilization,
              items: result.placed
            });
          }
        );
      });
    });
  });
});

export default router;
