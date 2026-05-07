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

import Containers from "./pages/Containers"
import Reparaciones from "./pages/Reparaciones"
import Reefer from "./pages/Reefer"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Containers />} />
          <Route path="/reparaciones" element={<Reparaciones />} />
          <Route path="/reefer" element={<Reefer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App