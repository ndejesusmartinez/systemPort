import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { login } from "../services/api"
import { saveAuthSession } from "../utils/auth"

function LoginForm() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.email || !form.password) {
      toast.error("Email and password are required")
      return
    }

    try {
      setLoading(true)

      const data = await login(form.email, form.password)

      const hasHttpError = Number(data?.statusCode) >= 400
      const hasApiError = Boolean(data?.error)

      if (hasHttpError || hasApiError) {
        throw new Error(data?.message || "Invalid credentials")
      }

      saveAuthSession(data)

      toast.success("Login successful")
      navigate("/")

    } catch (error) {
      console.error(error)
      toast.error(error?.message || "Unable to login")

    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="name@company.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

    </form>
  )
}

export default LoginForm