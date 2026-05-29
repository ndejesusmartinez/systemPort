import { useEffect, useState } from "react"

import {
  Package,
  Plus
} from "lucide-react"

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
    move: "GATE_IN",
    dateFrom: "",
    dateTo: ""
  })

  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [selectedContainer, setSelectedContainer] = useState(null)
  const [openPhotos, setOpenPhotos] = useState(false)

  useEffect(() => {
    // fetchContainers()
  }, [])

  useEffect(() => {

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

  function handleOpenPhotos(container) {
    setSelectedContainer(container)
    setOpenPhotos(true)
  }

  if (loading) {

    return (
      <div className="flex items-center justify-center h-[60vh]">

        <div className="text-center">

          <div
            className="
              w-14 h-14
              border-4
              border-blue-500
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-500">
            Loading containers...
          </p>

        </div>

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gray-100 px-4 py-4 sm:px-6 sm:py-6">

      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">

        {/* HEADER */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-gray-200
            p-4 sm:p-6
            flex flex-col md:flex-row
            md:items-center
            md:justify-between
            gap-4 sm:gap-5
          "
        >

          {/* LEFT */}
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">

            <div
              className="
                bg-blue-100
                text-blue-600
                h-12 w-12
                sm:h-16 sm:w-16
                rounded-2xl
                flex items-center justify-center
              "
            >
              <Package className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Containers
              </h1>

              <p className="text-gray-500 mt-1">
                Manage inspections and damages
              </p>

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="
              bg-blue-600 hover:bg-blue-700
              text-white
              w-full justify-center px-4 py-3
              sm:w-auto sm:px-6 sm:py-4
              rounded-2xl
              font-medium
              flex items-center gap-3
              transition
              shadow-lg shadow-blue-500/20
            "
          >

            <Plus size={20} />

            Add Container

          </button>

        </div>

        {/* KPI */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-gray-200
            p-4 sm:p-6
          "
        >
          <KPICards containers={filtered} />
        </div>

        {/* FILTERS */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-gray-200
            p-4 sm:p-6
          "
        >

          <div className="mb-5">

            <h2 className="text-xl font-semibold text-gray-800">
              Filters
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Search containers by status, type and movement
            </p>

          </div>

          <Filters
            filters={filters}
            setFilters={setFilters}
            onSearch={applyFilters}
          />

        </div>

        {/* TABLE */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-gray-200
            overflow-hidden
          "
        >

          <div
            className="
              px-4 py-4 sm:px-6 sm:py-5
              border-b
              border-gray-200
              flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between
            "
          >

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Container List
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filtered.length} containers found
              </p>

            </div>

          </div>

          <div className="overflow-x-auto">

            <ContainerTable
              data={filtered}
              onViewPhotos={handleOpenPhotos}
            />

          </div>

        </div>

      </div>

      {/* MODAL */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Container"
      >
        <ContainerForm onSuccess={handleSuccess} />
      </Modal>

      {/* PHOTOS MODAL */}
      <Modal
        isOpen={openPhotos}
        onClose={() => setOpenPhotos(false)}
        title={`Photos - ${selectedContainer?.container_id || ""}`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">

          {selectedContainer?.photos?.map((photo, index) => (

            <a
              key={index}
              href={photo}
              target="_blank"
              rel="noreferrer"
              className="
                block
                rounded-2xl
                overflow-hidden
                border
                border-gray-200
                hover:scale-[1.02]
                transition
              "
            >

              <img
                src={photo}
                alt={`Photo ${index}`}
                className="
                  w-full
                  h-52
                  object-cover
                "
              />

            </a>

          ))}

        </div>

        {!selectedContainer?.photos?.length && (
          <div className="text-center py-10 text-gray-500">
            No photos available
          </div>
        )}
      </Modal>

    </div>
  )
}

export default Containers