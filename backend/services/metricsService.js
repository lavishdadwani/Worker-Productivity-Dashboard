import Event from "../models/Event.js";

//
// 🧠 Helper: get time range
//
const getTimeRange = () => {
  const end = new Date();
  const start = new Date(end.getTime() - 8 * 60 * 60 * 1000); // last 8 hours
  return { start, end };
};

//
// 🧠 CORE ENGINE
//
export const computeMetrics = async () => {
  const { start, end } = getTimeRange();

  // ✅ Fetch only relevant events
  const events = await Event.find({
    timestamp: { $gte: start, $lte: end },
  }).sort({ worker_id: 1, timestamp: 1 });

  // ================================
  // 🧑‍🏭 WORKER GROUPING
  // ================================
  const workerGroups = {};

  for (const event of events) {
    if (!workerGroups[event.worker_id]) {
      workerGroups[event.worker_id] = [];
    }
    workerGroups[event.worker_id].push(event);
  }

  const workerResults = [];

  // ================================
  // 🧮 WORKER METRICS
  // ================================
  for (const [worker_id, workerEvents] of Object.entries(workerGroups)) {
    let activeTime = 0;
    let idleTime = 0;
    let totalTime = 0;
    let units = 0;

    for (let i = 0; i < workerEvents.length; i++) {
      const current = workerEvents[i];
      const next = workerEvents[i + 1];

      let duration = 0;

      if (next) {
        duration =
          new Date(next.timestamp) - new Date(current.timestamp);
      } else {
        duration = end - new Date(current.timestamp);
      }

      if (duration < 0) continue;

      if (current.event_type === "working") {
        activeTime += duration;
      } else if (current.event_type === "idle") {
        idleTime += duration;
      }

      totalTime += duration;

      if (current.event_type === "product_count") {
        units += current.count || 0;
      }
    }

    const hours = totalTime / (1000 * 60 * 60);

    workerResults.push({
      worker_id,
      activeTime: (activeTime / 60000).toFixed(2),
      idleTime: (idleTime / 60000).toFixed(2),
      utilization: totalTime
        ? ((activeTime / totalTime) * 100).toFixed(2)
        : "0.00",
      units,
      unitsPerHour: hours ? (units / hours).toFixed(2) : "0.00",
    });
  }

  // ================================
  // 🏭 WORKSTATION GROUPING
  // ================================
  const stationGroups = {};

  for (const event of events) {
    if (!stationGroups[event.workstation_id]) {
      stationGroups[event.workstation_id] = [];
    }
    stationGroups[event.workstation_id].push(event);
  }

  const workstationResults = [];

  // ================================
  // 🧮 WORKSTATION METRICS
  // ================================
  for (const [station_id, stationEvents] of Object.entries(stationGroups)) {
    stationEvents.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    let activeTime = 0;
    let totalTime = 0;
    let units = 0;

    for (let i = 0; i < stationEvents.length; i++) {
      const current = stationEvents[i];
      const next = stationEvents[i + 1];

      let duration = 0;

      if (next) {
        duration =
          new Date(next.timestamp) - new Date(current.timestamp);
      } else {
        duration = end - new Date(current.timestamp);
      }

      if (duration < 0) continue;

      if (current.event_type === "working") {
        activeTime += duration;
      }

      totalTime += duration;

      if (current.event_type === "product_count") {
        units += current.count || 0;
      }
    }

    const hours = totalTime / (1000 * 60 * 60);

    workstationResults.push({
      workstation_id: station_id,
      occupancyTime: (activeTime / 60000).toFixed(2),
      utilization: totalTime
        ? ((activeTime / totalTime) * 100).toFixed(2)
        : "0.00",
      units,
      throughput: hours ? (units / hours).toFixed(2) : "0.00",
    });
  }

  // ================================
  // 🧠 ENSURE ALL WORKERS EXIST
  // ================================
  const ALL_WORKERS = ["W1", "W2", "W3", "W4", "W5", "W6"];

  const workerMap = {};
  workerResults.forEach((w) => {
    workerMap[w.worker_id] = w;
  });

  const finalWorkers = ALL_WORKERS.map((id) => {
    return (
      workerMap[id] || {
        worker_id: id,
        activeTime: "0.00",
        idleTime: "0.00",
        utilization: "0.00",
        units: 0,
        unitsPerHour: "0.00",
      }
    );
  });

  // ================================
  // 🧠 ENSURE ALL WORKSTATIONS EXIST
  // ================================
  const ALL_STATIONS = ["S1", "S2", "S3", "S4", "S5", "S6"];

  const stationMap = {};
  workstationResults.forEach((s) => {
    stationMap[s.workstation_id] = s;
  });

  const finalWorkstations = ALL_STATIONS.map((id) => {
    return (
      stationMap[id] || {
        workstation_id: id,
        occupancyTime: "0.00",
        utilization: "0.00",
        units: 0,
        throughput: "0.00",
      }
    );
  });

  // ================================
  // 🏭 FACTORY METRICS
  // ================================
  let totalUnits = 0;
  let totalActive = 0;
  let totalTime = 0;

  finalWorkers.forEach((w) => {
    totalUnits += w.units;
    totalActive += parseFloat(w.activeTime);
    totalTime += parseFloat(w.activeTime) + parseFloat(w.idleTime);
  });

  const factory = {
    totalProduction: totalUnits,
    avgUtilization: totalTime
      ? ((totalActive / totalTime) * 100).toFixed(2)
      : "0.00",
  };

  // ================================
  // 🚀 FINAL RESPONSE
  // ================================
  return {
    workers: finalWorkers,
    workstations: finalWorkstations,
    factory,
  };
};