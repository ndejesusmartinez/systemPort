import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import LoginForm from "../components/LoginForm"
import { isAuthenticated } from "../utils/auth"

function Login() {

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">

          <div className="hidden bg-slate-900 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Port System</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Secure access to container operations
              </h1>
            </div>

            <p className="text-sm text-slate-300">
              Inspect, repair and track your fleet from one place.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
            <p className="mt-2 text-slate-500">Use your credentials to continue</p>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Login