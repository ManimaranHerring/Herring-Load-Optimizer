import express from "express";
import cors from "cors";
import containersRouter from "./routes/containers.js";
import shipmentsRouter from "./routes/shipments.js";
import optimizeRouter from "./routes/optimize.js";
import "./db.js"; // init

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "container-optimizer-backend" });
});

app.use("/containers", containersRouter);
app.use("/shipments", shipmentsRouter);
app.use("/optimize", optimizeRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
