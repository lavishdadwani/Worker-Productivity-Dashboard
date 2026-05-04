import { useEffect, useState } from "react";
import metrics from "./services/metrics";
import WorkerBarChart from "./components/WorkerBarChart";
import UtilizationChart from "./components/UtilizationChart";
import WorkstationCard from "./components/WorkstationCard";

function App() {
  const [data, setData] = useState(null);
  const [workerFilter, setWorkerFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("all");

  useEffect(() => {
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await metrics.getMetrics();
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading dashboard...
      </div>
    );
  }

  // ✅ FILTER LOGIC
  const filteredWorkers =
    workerFilter === "all"
      ? data.workers
      : data.workers.filter((w) => w.worker_id === workerFilter);

  const filteredStations =
    stationFilter === "all"
      ? data.workstations
      : data.workstations.filter(
          (s) => s.workstation_id === stationFilter
        );

  return (
    <div className="bg-gray-100 min-h-screen p-6 w-full max-w-7xl mx-auto" >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        AI Worker Productivity Dashboard
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="p-2 border rounded-lg"
          value={workerFilter}
          onChange={(e) => setWorkerFilter(e.target.value)}
        >
          <option value="all">All Workers</option>
          {data.workers.map((w) => (
            <option key={w.worker_id} value={w.worker_id}>
              {w.worker_id}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg"
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
        >
          <option value="all">All Stations</option>
          {data.workstations.map((s) => (
            <option key={s.workstation_id} value={s.workstation_id}>
              {s.workstation_id}
            </option>
          ))}
        </select>
      </div>

      {/* Factory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Production" value={data.factory.totalProduction} />
        <Card
          title="Avg Utilization"
          value={`${data.factory.avgUtilization}%`}
        />
        <Card title="Workers Active" value={filteredWorkers.length} />
      </div>

      {/* Charts (UPDATED ✅) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <WorkerBarChart workers={filteredWorkers} />
        <UtilizationChart workers={filteredWorkers} />
      </div>

      {/* Worker Cards (UPDATED ✅) */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Worker Performance
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <WorkerCard key={worker.worker_id} worker={worker} />
        ))}
      </div>

      {/* Workstation Cards (UPDATED ✅) */}
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
        Workstation Performance
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredStations.map((station) => (
          <WorkstationCard
            key={station.workstation_id}
            station={station}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

//
// 🔹 Reusable Card
//
function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-blue-600">{value}</h2>
    </div>
  );
}

//
// 🔹 Worker Card
//
function WorkerCard({ worker }) {
  const utilization = parseFloat(worker.utilization || 0);

  const utilizationColor =
    utilization > 70
      ? "text-green-600"
      : utilization > 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg mb-3 text-gray-800">
        Worker {worker.worker_id}
      </h3>

      <div className="space-y-1 text-sm">
        <p>🟢 Active: {worker.activeTime} min</p>
        <p>⚪ Idle: {worker.idleTime} min</p>

        <p className={utilizationColor}>
          📊 Utilization: {utilization.toFixed(2)}%
        </p>

        <p>📦 Units: {worker.units}</p>
        <p>⚡ Rate: {worker.unitsPerHour}/hr</p>
      </div>
    </div>
  );
}