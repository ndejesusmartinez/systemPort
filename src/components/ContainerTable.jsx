import { Images, CalendarDays, ArrowRightLeft, User } from "lucide-react"

const STATUS_STYLES = {
  OK: "bg-green-100 text-green-700 ring-1 ring-green-200",
  DAMAGED: "bg-red-100 text-red-700 ring-1 ring-red-200",
}

const TYPE_MOVE_LABELS = {
  GATE_IN: "Gate In",
  GATE_OUT: "Gate Out",
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  )
}

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
      {type}
    </span>
  )
}

function MoveBadge({ move }) {
  const isIn = move === "GATE_IN"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ${
        isIn
          ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
          : "bg-orange-50 text-orange-700 ring-orange-200"
      }`}
    >
      <ArrowRightLeft size={10} />
      {TYPE_MOVE_LABELS[move] ?? move}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <Images size={28} className="text-gray-300" />
      </div>
      <p className="text-sm font-medium text-gray-500">No containers found</p>
      <p className="text-xs text-gray-400">Use the filters above to run a search</p>
    </div>
  )
}

function ContainerTable({ data = [], onRowClick, onViewPhotos }) {

  if (!data.length) {
    return <EmptyState />
  }

  return (
    <div className="w-full">

      {/* ── MOBILE CARDS (< md) ──────────────────────────────────── */}
      <ul className="divide-y divide-gray-100 md:hidden">
        {data.map((c) => (
          <li
            key={c.id}
            onClick={() => onRowClick && onRowClick(c)}
            className="cursor-pointer px-4 py-5 transition-colors hover:bg-gray-50 active:bg-gray-100"
          >

            {/* Row 1 — Container ID + Photos button */}
            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold tracking-wide text-gray-900">
                  {c.container_id}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={c.status} />
                  <TypeBadge type={c.type} />
                  <MoveBadge move={c.type_move} />
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewPhotos(c)
                }}
                className="mt-0.5 shrink-0 rounded-xl border border-gray-200 bg-white p-2 text-gray-400 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                aria-label="View photos"
              >
                <Images size={16} />
              </button>

            </div>

            {/* Row 2 — metadata */}
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">

              <div className="flex items-center gap-1.5">
                <CalendarDays size={13} className="shrink-0 text-gray-400" />
                <span>{c.created_at.split("T")[0]}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <User size={13} className="shrink-0 text-gray-400" />
                <span className="truncate">{c.inspector}</span>
              </div>

            </div>

          </li>
        ))}
      </ul>

      {/* ── DESKTOP TABLE (≥ md) ─────────────────────────────────── */}
      <table className="hidden w-full text-sm md:table">

        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5">Move</th>
            <th className="px-5 py-3.5">Container</th>
            <th className="px-5 py-3.5">Type</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Inspector</th>
            <th className="px-5 py-3.5 text-center">Photos</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((c) => (
            <tr
              key={c.id}
              onClick={() => onRowClick && onRowClick(c)}
              className="cursor-pointer transition-colors hover:bg-gray-50"
            >

              <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                {c.created_at.split("T")[0]}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <MoveBadge move={c.type_move} />
              </td>

              <td className="whitespace-nowrap px-5 py-4 font-semibold tracking-wide text-gray-900">
                {c.container_id}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <TypeBadge type={c.type} />
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <StatusBadge status={c.status} />
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                {c.inspector}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewPhotos(c)
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-100 p-2 text-gray-500 transition hover:bg-blue-100 hover:text-blue-600"
                  aria-label="View photos"
                >
                  <Images size={16} />
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

export default ContainerTable