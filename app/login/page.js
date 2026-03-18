"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "../../utils/api"

export default function Login() {

  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Form Data:", form) // ✅ DEBUG

    try {

      setLoading(true)

      const res = await API.post(
        "/api/v1/auth/login",
        form,
        {
          withCredentials: true
        }
      )

      console.log("Login Success:", res.data)

      alert("Login successful")

      router.push("/dashboard")

    } catch (error) {

      console.log("ERROR:", error.response?.data || error.message)

      alert(
        error.response?.data?.message || "Login failed"
      )

    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >

        <h2 className="text-2xl mb-4 text-center">
          Login
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />

        <button
          disabled={loading}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  )
}