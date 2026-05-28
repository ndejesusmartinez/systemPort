function Modal({ isOpen, onClose, children, title }) {

  if (!isOpen) return null

  return (

    <div
      className="
        fixed inset-0
        bg-black/40
        backdrop-blur-sm
        z-50
        overflow-y-auto
      "
    >

      {/* WRAPPER */}
      <div
        className="
          min-h-screen
          flex
          items-start
          justify-center
          p-3 sm:p-4 md:p-8
        "
      >

        {/* MODAL */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-2xl
            w-full
            max-w-4xl
            relative
            max-h-[95vh]
            overflow-y-auto
          "
        >

          {/* HEADER */}
          <div
            className="
              sticky top-0
              bg-white
              border-b
              border-gray-200
              px-4 py-4 sm:px-6
              flex
              justify-between
              items-center
              gap-3
              rounded-t-3xl
              z-10
            "
          >

            <h2 className="text-lg font-bold text-gray-800 sm:text-2xl">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="
                h-10 w-10
                shrink-0
                flex items-center justify-center
                rounded-xl
                text-gray-500
                hover:bg-gray-100
                hover:text-black
                transition
              "
            >
              ✖
            </button>

          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6">
            {children}
          </div>

        </div>

      </div>

    </div>

  )
}

export default Modal