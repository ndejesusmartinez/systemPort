function KPICards({ containers }) {

  const total = containers.length
  const ok = containers.filter(c => c.status === "OK").length
  const damaged = containers.filter(c => c.status === "DAMAGED").length

  const Card = ({ title, value, color }) => (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow sm:p-5">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold sm:text-2xl">{value}</h2>
      </div>
      <div className={`h-10 w-10 rounded-full ${color} shrink-0`} />
    </div>
  )

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
      <Card title="Total Containers" value={total} color="bg-blue-500" />
      <Card title="OK" value={ok} color="bg-green-500" />
      <Card title="Damaged" value={damaged} color="bg-red-500" />
    </div>
  )
}

export default KPICards