import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const menu = [
    { name: "Inspecciones", path: "/", icon: "📦" },
    { name: "Reparaciones", path: "/reparaciones", icon: "🛠" },
    { name: "Reefer", path: "/reefer", icon: "❄️" }
  ]

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: collapsed ? "80px" : "250px",
          background: "#0f172a",
          color: "white",
          transition: "0.3s",
          padding: "15px"
        }}
      >
        {/* LOGO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!collapsed && <h2>🚢 PortSys</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer"
            }}
          >
            ☰
          </button>
        </div>

        {/* MENU */}
        <nav style={{ marginTop: "30px" }}>
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "white",
                background:
                  location.pathname === item.path ? "#1e293b" : "transparent"
              }}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* HEADER */}
        <header
          style={{
            height: "60px",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px"
          }}
        >
          <h3>
            {menu.find((m) => m.path === location.pathname)?.name || "Dashboard"}
          </h3>

          <div>
            👤 Naren
          </div>
        </header>

        {/* CONTENT */}
        <main
          style={{
            flex: 1,
            padding: "20px",
            background: "#f1f5f9",
            overflow: "auto"
          }}
        >
          {children}
        </main>

      </div>
    </div>
  )
}

export default Layout