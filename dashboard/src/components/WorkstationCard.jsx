export default function WorkstationCard({ station }) {
    const color =
      station.utilization > 70
        ? "text-green-600"
        : station.utilization > 40
        ? "text-yellow-500"
        : "text-red-500";
  
    return (
      <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="font-bold text-lg mb-3 text-purple-600">
          Station {station.workstation_id}
        </h3>
  
        <div className="space-y-1 text-sm">
          <p>⏱️ Occupancy: {station.occupancyTime} min</p>
          <p className={color}>📊 Utilization: {station.utilization}%</p>
          <p>📦 Units: {station.units}</p>
          <p>⚡ Throughput: {station.throughput}/hr</p>
        </div>
      </div>
    );
  }