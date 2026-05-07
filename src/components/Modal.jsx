function Modal({ isOpen, onClose, children, title }) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      {/* CONTENEDOR */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✖
          </button>
        </div>

        {/* CONTENT */}
        {children}

      </div>

    </div>
  )
}

export default Modal