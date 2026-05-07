import { useEffect, useState } from "react"
import { getContainers } from "../services/api"

import ContainerForm from "../components/ContainerForm"
import KPICards from "../components/KPICards"
import Filters from "../components/Filters"
import ContainerTable from "../components/ContainerTable"
import Modal from "../components/Modal"

function Containers() {

  const [containers, setContainers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [filters, setFilters] = useState({
    status: "OK",
    type: "DRY",
    "move": "GATE_IN"
  })
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    // fetchContainers()
  }, [])

  // useEffect(() => {
  //   applyFilters()
  // }, [filters, containers])

  useEffect(() => {
    // 🚫 NO buscar al cargar pantalla
    if (!hasSearched) return

    applyFilters()

  }, [filters])

  async function fetchContainers() {
    try {
      setLoading(true)
      const res = await getContainers()
      setContainers(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function applyFilters() {
    try {

      setLoading(true)

      const res = await getContainers(filters)

      setFiltered(res.data || [])

      // 🔥 activar auto búsqueda
      setHasSearched(true)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  function handleSuccess() {
    fetchContainers()
    setOpenModal(false)
  }

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>
  }

  return (
    <div className="space-y-6">

      {/* KPIs */}
      <KPICards containers={filtered} />

      {/* FORM */}
      {/* <ContainerForm onSuccess={fetchContainers} /> */}
      <div className="flex justify-between items-center">

        <h1 className="text-xl font-semibold">📦 Containers</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Gate...
        </button>

      </div>

      {/* FILTROS */}
      {/* <Filters filters={filters} setFilters={setFilters} /> */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        onSearch={applyFilters}
      />

      {/* TABLA */}
      <ContainerTable data={filtered} />

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Container"
      >
        <ContainerForm onSuccess={handleSuccess} />
      </Modal>

    </div>
  )
}

export default Containers