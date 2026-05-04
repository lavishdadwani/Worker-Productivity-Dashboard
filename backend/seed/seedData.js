import Worker from "../models/Worker.js";
import Workstation from "../models/Workstation.js";

export const seedData = async () => {
  await Worker.deleteMany();
  await Workstation.deleteMany();

  const workers = Array.from({ length: 6 }, (_, i) => ({
    worker_id: `W${i + 1}`,
    name: `Worker ${i + 1}`,
  }));

  const stations = Array.from({ length: 6 }, (_, i) => ({
    workstation_id: `S${i + 1}`,
    name: `Station ${i + 1}`,
  }));

  await Worker.insertMany(workers);
  await Workstation.insertMany(stations);

  console.log("Seed data inserted");
};