import { useState, useEffect } from "react"
import { createContainer, uploadPhoto, getDamages } from "../services/api"
import { toast } from "sonner"

function ContainerForm({ onSuccess }) {

  const [form, setForm] = useState({
    prefix: "",
    number: "",
    dv: "",
    type: "DRY",
    status: "OK",
    inspector: "",
    damages: [],
    type_move: ""
  })

  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  // catálogo agrupado
  const [listDamages, setListDamages] = useState([])

  // selección dinámica
  const [selectedComponentId, setSelectedComponentId] = useState("")
  const [selectedDamageId, setSelectedDamageId] = useState("")

  // =========================
  // INPUTS
  // =========================
  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // =========================
  // FETCH CATALOGO
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
  // COMPONENT SELECTED (DERIVADO)
  // =========================
  const selectedComponent = listDamages.find(
    c => c.component_id === selectedComponentId
  )

  // =========================
  // ADD DAMAGE
  // =========================
  const addDamage = () => {

  const component = listDamages.find(
    c => c.component_id === selectedComponentId
  )

  if (!component || !selectedDamageId) return

  const damage = component.damages.find(
    d => d.id === selectedDamageId
  )

  if (!damage) return

  setForm(prev => ({
    ...prev,
    damages: [
      ...prev.damages,
      {
        id: crypto.randomUUID(),
        component: component.component,
        damage_type: damage.name
      }
    ]
  }))

  setSelectedComponentId("")
  setSelectedDamageId("")
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

    if (!form.prefix || !form.number || !form.dv || !form.inspector) {
      toast.error("All fields are required")
      return
    }

    if (form.status === "DAMAGED" && form.damages.length === 0) {
      toast.error("Add at least one damage")
      return
    }

    try {
      setUploading(true)

      const uploadedUrls = []

      const containerId = `${form.prefix}${form.number}${form.dv}`

      for (const photo of photos) {
        const res = await uploadPhoto(photo, containerId)
        uploadedUrls.push(res.url)
      }

      const payload = {
        ...form,
        photos: uploadedUrls,
        damages: form.status === "DAMAGED" ? form.damages : []
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
        type_move: ""
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
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">➕ Add Container</h2>
        <p className="text-sm text-gray-500">Gate In</p>
      </div>

      {/* FORM BASICO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input name="prefix" placeholder="Prefix"
          className="border p-2 rounded"
          value={form.prefix}
          onChange={handleChange}
        />

        <input name="number" placeholder="Number"
          className="border p-2 rounded"
          value={form.number}
          onChange={handleChange}
        />

        <input name="dv" placeholder="DV"
          className="border p-2 rounded"
          value={form.dv}
          onChange={handleChange}
        />

        <select name="type"
          className="border p-2 rounded"
          value={form.type}
          onChange={handleChange}
        >
          <option value="DRY">DRY</option>
          <option value="REEFER">REEFER</option>
        </select>

        <select name="type_move"
          className="border p-2 rounded"
          value={form.type_move}
          onChange={handleChange}
        >
          <option value="GATE_IN">GATE IN</option>
          <option value="GATE_OUT">GATE OUT</option>
        </select>

        <select name="status"
          className="border p-2 rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option value="OK">OK</option>
          <option value="DAMAGED">DAMAGED</option>
        </select>

        <input name="inspector" placeholder="Inspector"
          className="border p-2 rounded"
          value={form.inspector}
          onChange={handleChange}
        />

      </div>

      {/* DAMAGES */}
      {form.status === "DAMAGED" && (
        <div className="border p-4 rounded bg-gray-50">

          <h3 className="font-medium mb-3">
            ⚠️ Detected Damages
          </h3>

          {/* COMPONENT */}
          <select
            className="w-full border p-2 rounded mb-3"
            value={selectedComponentId}
            onChange={(e) => {
              setSelectedComponentId(e.target.value)
              setSelectedDamageId("")
            }}
          >
            <option value="">Select component</option>

            {listDamages.map(c => (
              <option key={c.component_id} value={c.component_id}>
                {c.component}
              </option>
            ))}
          </select>

          {/* DAMAGE */}
          {selectedComponent && (
            <div className="flex gap-2">

              <select
                className="flex-1 border p-2 rounded"
                value={selectedDamageId}
                onChange={(e) => setSelectedDamageId(e.target.value)}
              >
                <option value="">Select damage</option>

                {selectedComponent.damages.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addDamage}
                className="bg-yellow-500 text-white px-4 rounded"
              >
                +
              </button>

            </div>
          )}

          {/* LIST */}
          <div className="mt-4 space-y-2">

            {form.damages.map(d => (
              <div
                key={d.id}
                className="flex justify-between border p-2 rounded bg-white"
              >
                <span>
                  {d.component} - {d.damage_type}
                </span>

                <button
                  type="button"
                  onClick={() => removeDamage(d.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* PHOTOS */}
      <div>

        <h3 className="font-medium mb-3">
          📸 Photos of the Container
        </h3>

        <div className="flex gap-3 flex-wrap">

          {/* UPLOAD */}
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">

            Upload photo

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotos}
            />

          </label>

          {/* CAMERA */}
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700">

            Take photos

            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotos}
            />

          </label>

        </div>

        {/* PREVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">

          {photos.map((photo, index) => (

            <div
              key={index}
              className="relative border rounded-lg overflow-hidden"
            >

              <img
                src={URL.createObjectURL(photo)}
                alt="preview"
                className="w-full h-32 object-cover"
              />

              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
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
        className="w-full bg-blue-600 text-white p-3 rounded"
      >
        {uploading ? "Creating..." : "Save Container"}
      </button>

    </form>
  )
}

export default ContainerForm