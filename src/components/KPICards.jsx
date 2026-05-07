function KPICards({ containers }) {

  const total = containers.length
  const ok = containers.filter(c => c.status === "OK").length
  const damaged = containers.filter(c => c.status === "DAMAGED").length

  const Card = ({ title, value, color }) => (
    <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className={`w-10 h-10 rounded-full ${color}`} />
    </div>
  )

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <Card title="Total Containers" value={total} color="bg-blue-500" />
      <Card title="OK" value={ok} color="bg-green-500" />
      <Card title="Damaged" value={damaged} color="bg-red-500" />
    </div>
  )
}

export default KPICards