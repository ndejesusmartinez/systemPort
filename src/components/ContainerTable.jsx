function ContainerTable({ data = [], onRowClick }) {

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
        Empty search. Use the filters to find containers.
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">

      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Container</th>
            <th className="p-4 text-left">Tipo</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-left">Inspector</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((c) => (
            <tr
              key={c.id}
              onClick={() => onRowClick && onRowClick(c)}
              className="border-t hover:bg-gray-50 cursor-pointer transition"
            >

              <td className="p-4 text-xs text-gray-500">
                {c.id}
              </td>

              <td className="p-4 font-medium">
                {c.container_id}
              </td>

              <td className="p-4">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {c.type}
                </span>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.status === "OK"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </span>
              </td>

              <td className="p-4">
                {c.inspector}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default ContainerTable