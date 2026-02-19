import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function SalesChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white/5 p-4 rounded-lg h-72">
      <h2 className="font-semibold mb-3">Sales Trend</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
