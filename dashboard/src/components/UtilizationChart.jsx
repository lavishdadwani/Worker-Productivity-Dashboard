import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from "recharts";
  
  export default function UtilizationChart({ workers }) {
    const formattedData = workers.map((w) => ({
      worker_id: w.worker_id,
      utilization: parseFloat(w.utilization),
    }));
  
    return (
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Worker Utilization Trend
        </h2>
  
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="worker_id" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="utilization"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }