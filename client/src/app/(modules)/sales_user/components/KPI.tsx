export default function KPI({
  title,
  value
}: {
  title: string
  value: number
}) {
  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-xl font-bold">₹{value}</p>
    </div>
  )
}
