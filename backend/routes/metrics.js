import express from "express";
import { computeMetrics } from "../services/metricsService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await computeMetrics();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Metrics computation failed" });
  }
});

export default router;