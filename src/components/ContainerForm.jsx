import { useState, useEffect } from "react"
import {
  Package,
  AlertTriangle,
  Camera,
  Upload,
  Trash2,
  Plus
} from "lucide-react"

import {
  createContainer,
  uploadPhoto,
  getDamages
} from "../services/api"

import { toast } from "sonner"
import { calculateContainerDV } from "../utils/containerDV"

function ContainerForm({ onSuccess }) {

  const [form, setForm] = useState({
    prefix: "",
    number: "",
    dv: "",
    type: "DRY",
    status: "OK",
    inspector: "",
    damages: [],
    type_move: "GATE_IN"
  })

  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  const [listDamages, setListDamages] = useState([])

  const [selectedComponentId, setSelectedComponentId] = useState("")
  const [selectedDamageId, setSelectedDamageId] = useState("")

  const [damageMeasures, setDamageMeasures] = useState({
    length: "",
    width: "",
    height: ""
  })

  // =========================
  // STYLES
  // =========================

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

  const sectionClass =
    "bg-gray-50 border border-gray-200 rounded-2xl p-5"

  // =========================
  // INPUTS
  // =========================

  // function handleChange(e) {
  //   setForm(prev => ({
  //     ...prev,
  //     [e.target.name]: e.target.value
  //   }))
  // }
  function handleChange(e) {

    let { name, value } = e.target

    // PREFIX SOLO LETRAS
    if (name === "prefix") {
      value = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4)
    }

    // NUMBER SOLO NUMEROS
    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 6)
    }

    const updatedForm = {
      ...form,
      [name]: value
    }

    // CALCULAR DV
    if (
      updatedForm.prefix.length === 4 &&
      updatedForm.number.length === 6
    ) {

      updatedForm.dv = calculateContainerDV(
        updatedForm.prefix,
        updatedForm.number
      )

    } else {

      updatedForm.dv = ""
    }

    setForm(updatedForm)
  }

  // =========================
  // FETCH DAMAGES
  // =========================

  async function fetchDamages() {
    try {
      const res = await getDamages()
      setListDamages(res.data || [])
    } catch (error) {
      console.error(error)
      toast.error("Error loading damages")
    }
  }

  useEffect(() => {
    fetchDamages()
  }, [])

  // =========================
  // DERIVED
  // =========================

  const selectedComponent = listDamages.find(
    c => c.component_id === selectedComponentId
  )

  const selectedDamage = selectedComponent?.damages?.find(
    d => d.id === selectedDamageId
  )

  // =========================
  // ADD DAMAGE
  // =========================

  const addDamage = () => {

    if (!selectedComponent || !selectedDamage) return

    let measurements = {}

    if (selectedDamage.name === "Cut") {
      measurements = {
        length: damageMeasures.length || null
      }
    }

    if (["Broken", "Dented"].includes(selectedDamage.name)) {
      measurements = {
        width: damageMeasures.width || null,
        height: damageMeasures.height || null
      }
    }

    setForm(prev => ({
      ...prev,
      damages: [
        ...prev.damages,
        {
          id: crypto.randomUUID(),
          component: selectedComponent.component,
          damage_type: selectedDamage.name,
          measurements
        }
      ]
    }))

    setSelectedDamageId("")

    setDamageMeasures({
      length: "",
      width: "",
      height: ""
    })
  }

  // =========================
  // REMOVE DAMAGE
  // =========================

  function removeDamage(id) {
    setForm(prev => ({
      ...prev,
      damages: prev.damages.filter(d => d.id !== id)
    }))
  }

  // =========================
  // PHOTOS
  // =========================

  function handlePhotos(e) {
    const files = Array.from(e.target.files)
    setPhotos(prev => [...prev, ...files])
  }

  function removePhoto(index) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(e) {
    e.preventDefault()

    if (
      !form.prefix ||
      !form.number ||
      !form.dv ||
      !form.inspector ||
      (
        form.status === "DAMAGED" &&
        (!form.damages || form.damages.length === 0)
      )
    ) {
      toast.error("All fields are required")
      return
    }

    try {

      setUploading(true)

      const containerId =
        `${form.prefix}${form.number}${form.dv}`

      const uploadedUrls = []

      for (const photo of photos) {
        const res = await uploadPhoto(photo, containerId)
        uploadedUrls.push(res.url)
      }

      const payload = {
        ...form,
        photos: uploadedUrls,
        damages:
          form.status === "DAMAGED"
            ? form.damages
            : []
      }

      await createContainer(payload)

      toast.success("Container created")

      setForm({
        prefix: "",
        number: "",
        dv: "",
        type: "DRY",
        status: "OK",
        inspector: "",
        damages: [],
        type_move: "GATE_IN"
      })

      setPhotos([])
      setSelectedComponentId("")
      setSelectedDamageId("")

      if (onSuccess) onSuccess()

    } catch (error) {

      console.error(error)
      toast.error("Error creating container")

    } finally {

      setUploading(false)

    }
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-5xl w-full">

      {/* HEADER */}
      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
            <Package size={26} />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Add Container
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Register container inspection details
            </p>
          </div>

        </div>

      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* GENERAL INFO */}
        <div className={sectionClass}>

          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Prefix
              </label>

              <input
                name="prefix"
                className={inputClass}
                value={form.prefix}
                onChange={handleChange}
                placeholder="Enter prefix"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Number
              </label>

              <input
                name="number"
                className={inputClass}
                value={form.number}
                onChange={handleChange}
                placeholder="Enter number"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">
                DV
              </label>

              <input
                name="dv"
                className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                value={form.dv}
                readOnly
                placeholder="Auto"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Container Type
              </label>

              <select
                name="type"
                className={inputClass}
                value={form.type}
                onChange={handleChange}
              >
                <option value="DRY">DRY</option>
                <option value="REEFER">REEFER</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Movement
              </label>

              <select
                name="type_move"
                className={inputClass}
                value={form.type_move}
                onChange={handleChange}
              >
                <option value="GATE_IN">GATE IN</option>
                <option value="GATE_OUT">GATE OUT</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Status
              </label>

              <select
                name="status"
                className={inputClass}
                value={form.status}
                onChange={handleChange}
              >
                <option value="OK">OK</option>
                <option value="DAMAGED">DAMAGED</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-2">
                Inspector
              </label>

              <input
                name="inspector"
                className={inputClass}
                value={form.inspector}
                onChange={handleChange}
                placeholder="Inspector name"
              />
            </div>

          </div>

        </div>

        {/* DAMAGES */}
        {form.status === "DAMAGED" && (

          <div className={sectionClass}>

            <div className="flex items-center gap-2 mb-5">

              <AlertTriangle
                className="text-yellow-500"
                size={22}
              />

              <h3 className="text-lg font-semibold text-gray-800">
                Detected Damages
              </h3>

            </div>

            {/* COMPONENT */}
            <div className="mb-4">

              <label className="text-sm text-gray-600 block mb-2">
                Component
              </label>

              <select
                className={inputClass}
                value={selectedComponentId}
                onChange={(e) => {
                  setSelectedComponentId(e.target.value)
                  setSelectedDamageId("")
                }}
              >
                <option value="">Select component</option>

                {listDamages.map(c => (
                  <option
                    key={c.component_id}
                    value={c.component_id}
                  >
                    {c.component}
                  </option>
                ))}

              </select>

            </div>

            {/* DAMAGE */}
            {selectedComponent && (

              <div className="flex gap-3 items-end">

                <div className="flex-1">

                  <label className="text-sm text-gray-600 block mb-2">
                    Damage Type
                  </label>

                  <select
                    className={inputClass}
                    value={selectedDamageId}
                    onChange={(e) =>
                      setSelectedDamageId(e.target.value)
                    }
                  >
                    <option value="">
                      Select damage
                    </option>

                    {selectedComponent.damages.map(d => (
                      <option
                        key={d.id}
                        value={d.id}
                      >
                        {d.name}
                      </option>
                    ))}

                  </select>

                </div>

                <button
                  type="button"
                  onClick={addDamage}
                  className="
                    w-14 h-14
                    rounded-2xl
                    bg-yellow-500 hover:bg-yellow-600
                    text-white
                    flex items-center justify-center
                    transition
                    shadow-lg
                  "
                >
                  <Plus size={24} />
                </button>

              </div>

            )}

            {/* MEASUREMENTS */}
            {selectedDamage && (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                {selectedDamage.name === "Cut" && (

                  <div className="md:col-span-2">

                    <label className="text-sm text-gray-600 block mb-2">
                      Length
                    </label>

                    <input
                      className={inputClass}
                      placeholder="Length"
                      value={damageMeasures.length}
                      onChange={(e) =>
                        setDamageMeasures(prev => ({
                          ...prev,
                          length: e.target.value
                        }))
                      }
                    />

                  </div>

                )}

                {["Broken", "Dented"].includes(
                  selectedDamage.name
                ) && (
                  <>
                    <div>

                      <label className="text-sm text-gray-600 block mb-2">
                        Width
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Width"
                        value={damageMeasures.width}
                        onChange={(e) =>
                          setDamageMeasures(prev => ({
                            ...prev,
                            width: e.target.value
                          }))
                        }
                      />

                    </div>

                    <div>

                      <label className="text-sm text-gray-600 block mb-2">
                        Height
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Height"
                        value={damageMeasures.height}
                        onChange={(e) =>
                          setDamageMeasures(prev => ({
                            ...prev,
                            height: e.target.value
                          }))
                        }
                      />

                    </div>
                  </>
                )}

              </div>

            )}

            {/* DAMAGE LIST */}
            <div className="mt-6 space-y-3">

              {form.damages.map(d => (

                <div
                  key={d.id}
                  className="
                    flex items-center justify-between
                    bg-white
                    border border-gray-200
                    rounded-2xl
                    p-4
                    shadow-sm
                  "
                >

                  <div>

                    <p className="font-semibold text-gray-800">
                      {d.component}
                    </p>

                    <p className="text-sm text-gray-500">
                      {d.damage_type}
                    </p>

                    <div className="text-xs text-gray-400 mt-1">

                      {d.measurements.length &&
                        `L: ${d.measurements.length}cm `}

                      {d.measurements.width &&
                        `W: ${d.measurements.width}cm `}

                      {d.measurements.height &&
                        `H: ${d.measurements.height}cm`}

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => removeDamage(d.id)}
                    className="
                      bg-red-50 hover:bg-red-100
                      text-red-500
                      p-3
                      rounded-xl
                      transition
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* PHOTOS */}
        <div className={sectionClass}>

          <div className="flex items-center gap-2 mb-5">

            <Camera
              className="text-blue-500"
              size={22}
            />

            <h3 className="text-lg font-semibold text-gray-800">
              Photos of the Container
            </h3>

          </div>

          <div className="flex flex-wrap gap-4">

            <label
              className="
                bg-blue-600 hover:bg-blue-700
                text-white
                px-5 py-3
                rounded-2xl
                cursor-pointer
                transition
                shadow-lg shadow-blue-500/20
                flex items-center gap-2
              "
            >

              <Upload size={18} />

              Upload

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotos}
              />

            </label>

            {/* <label
              className="
                bg-green-600 hover:bg-green-700
                text-white
                px-5 py-3
                rounded-2xl
                cursor-pointer
                transition
                shadow-lg shadow-green-500/20
                flex items-center gap-2
              "
            >

              <Camera size={18} />

              Camera

              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotos}
              />

            </label> */}

          </div>

          {/* PHOTOS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            {photos.map((photo, i) => (

              <div
                key={i}
                className="
                  relative
                  group
                  rounded-2xl
                  overflow-hidden
                  shadow-md
                "
              >

                <img
                  src={URL.createObjectURL(photo)}
                  className="
                    w-full h-40 object-cover
                    group-hover:scale-105
                    transition duration-300
                  "
                />

                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="
                    absolute top-2 right-2
                    bg-black/60 hover:bg-red-500
                    text-white
                    w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    transition
                  "
                >
                  ✖
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={uploading}
          className="
            w-full
            bg-blue-600 hover:bg-blue-700
            text-white
            py-4
            rounded-2xl
            font-semibold
            text-lg
            transition
            shadow-xl shadow-blue-500/20
            disabled:opacity-50
          "
        >
          {uploading
            ? "Creating..."
            : "Save Container"}
        </button>

      </form>

    </div>
  )
}

export default ContainerForm