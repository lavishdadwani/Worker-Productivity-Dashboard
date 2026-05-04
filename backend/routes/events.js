import express from "express";
import { z } from "zod";
import Event from "../models/Event.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

//
// ✅ Validation Schema
//
const eventSchema = z.object({
  timestamp: z.string().datetime(),
  worker_id: z.string().min(1),
  workstation_id: z.string().min(1),
  event_type: z.enum(["working", "idle", "absent", "product_count"]),
  confidence: z.number().min(0).max(1).optional(),
  count: z.number().int().positive().optional(),
});

//
// ✅ POST /events
//
router.post("/", async (req, res) => {
  try {
    // 1. Validate input
    const parsed = eventSchema.parse(req.body);

    // 2. Convert timestamp
    const timestamp = new Date(parsed.timestamp);

    // 3. Reject future timestamps
    if (timestamp > new Date()) {
      return res.status(400).json({
        message: "Future timestamps are not allowed",
      });
    }

    // 4. Validate product_count logic
    if (parsed.event_type === "product_count" && !parsed.count) {
      return res.status(400).json({
        message: "count is required for product_count events",
      });
    }

    // 5. Create event payload
    const eventData = {
      event_id: uuidv4(), // ✅ unique ID (important)
      timestamp,
      worker_id: parsed.worker_id,
      workstation_id: parsed.workstation_id,
      event_type: parsed.event_type,
      confidence: parsed.confidence ?? null,
      count: parsed.count ?? 0,
    };

    // 6. Save event
    const savedEvent = await Event.create(eventData);

    return res.status(201).json({
      message: "Event stored successfully",
      data: savedEvent,
    });

  } catch (error) {
    // 🔹 Validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid event data",
        errors: error.errors,
      });
    }

    // 🔹 Mongo duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate event (event_id conflict)",
      });
    }

    console.error("Event API Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;