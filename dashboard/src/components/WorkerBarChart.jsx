import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from "recharts";
  
  export default function WorkerBarChart({ workers }) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Worker Productivity (Units)
        </h2>
  
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="worker_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="units" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }