// function Filters({ filters, setFilters }) {

//   function handleChange(e) {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value
//     })
//   }

//   return (
//     <div className="flex gap-3 mb-4">

//       <select
//         name="status"
//         value={filters.status}
//         onChange={handleChange}
//         className="border p-2 rounded"
//       >
//         <option value="">Estado</option>
//         <option value="OK">OK</option>
//         <option value="DAMAGED">DAMAGED</option>
//       </select>

//       <select
//         name="type"
//         value={filters.type}
//         onChange={handleChange}
//         className="border p-2 rounded"
//       >
//         <option value="">Tipo</option>
//         <option value="DRY">DRY</option>
//         <option value="REEFER">REEFER</option>
//       </select>

//     </div>
//   )
// }

// export default Filters

function Filters({
  filters,
  setFilters,
  onSearch
}) {

  function handleChange(e) {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <div className="flex flex-col md:flex-row gap-3">

        {/* STATUS */}
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          <option value="OK">OK</option>
          <option value="DAMAGED">DAMAGED</option>
        </select>

        {/* TYPE */}
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          {/* <option value="">Tipo</option> */}
          <option value="">All</option>
          <option value="DRY">DRY</option>
          <option value="REEFER">REEFER</option>
        </select>

        <select
          name="move"
          value={filters.move}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          {/* <option value="">Tipo</option> */}
          <option value="">All</option>
          <option value="GATE_IN">GATE_IN</option>
          <option value="GATE_OUT">GATE_OUT</option>
        </select>

        {/* SEARCH BUTTON */}
        <button
          onClick={onSearch}
          className="w-full rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 md:w-auto"
        >
          search
        </button>

      </div>

    </div>
  )
}

export default Filters