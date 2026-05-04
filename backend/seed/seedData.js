import Worker from "../models/Worker.js";
import Workstation from "../models/Workstation.js";
import Event from "../models/Event.js";

export const seedData = async () => {
  // 🧹 Clear old data
  await Worker.deleteMany();
  await Workstation.deleteMany();
  await Event.deleteMany();

  // 👷 Workers
  const workers = Array.from({ length: 6 }, (_, i) => ({
    worker_id: `W${i + 1}`,
    name: `Worker ${i + 1}`,
  }));

  // 🏭 Stations
  const stations = Array.from({ length: 6 }, (_, i) => ({
    workstation_id: `S${i + 1}`,
    name: `Station ${i + 1}`,
  }));

  await Worker.insertMany(workers);
  await Workstation.insertMany(stations);

  // 🕒 Time setup (last 8 hours)
  const now = new Date();
  const shiftStart = new Date(now.getTime() - 8 * 60 * 60 * 1000);

  const events = [];

  workers.forEach((worker, i) => {
    const station = stations[i];

    // Each worker gets timeline events
    for (let h = 0; h < 8; h++) {
      const baseTime = new Date(shiftStart.getTime() + h * 60 * 60 * 1000);

      // ⏱️ Working start
      events.push({
        event_id: `${worker.worker_id}-${h}-start`,
        worker_id: worker.worker_id,
        workstation_id: station.workstation_id,
        event_type: "working",
        timestamp: new Date(baseTime),
      });

      // 📦 Production event (mid-hour)
      events.push({
        event_id: `${worker.worker_id}-${h}-prod`,
        worker_id: worker.worker_id,
        workstation_id: station.workstation_id,
        event_type: "product_count",
        count: Math.floor(Math.random() * 5) + 5, // 5–10 units
        timestamp: new Date(baseTime.getTime() + 30 * 60 * 1000),
      });

      // 😴 Idle end
      events.push({
        event_id: `${worker.worker_id}-${h}-idle`,
        worker_id: worker.worker_id,
        workstation_id: station.workstation_id,
        event_type: "idle",
        timestamp: new Date(baseTime.getTime() + 50 * 60 * 1000),
      });
    }
  });

  await Event.insertMany(events);

  console.log("✅ Full seed data inserted");
};