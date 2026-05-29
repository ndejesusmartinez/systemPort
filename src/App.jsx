// import Containers from "./pages/Containers"

// function App() {
//   return (
//     <div>
//       <h1>🚢 Port Container System</h1>
//       <Containers />
//     </div>
//   )
// }

// export default App

// import Layout from "./components/Layout"
// import Containers from "./pages/Containers"

// function App() {
//   return (
//     <Layout>
//       <Containers />
//     </Layout>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"

import Containers from "./pages/Containers"
import Reparaciones from "./pages/Reparaciones"
import Reefer from "./pages/Reefer"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Containers />} />
            <Route path="/reparaciones" element={<Reparaciones />} />
            <Route path="/reefer" element={<Reefer />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App