"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [editingId, setEditingId] = useState(null) // Track which task is being edited

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Redirect if not logged in
  useEffect(() => {
    if (!token) window.location.href = "/login"
  }, [token])

  // FETCH TASKS with pagination
  const fetchTasks = async () => {
    if (!token) return
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setTasks(data.data || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  // CREATE OR UPDATE TASK
  const submitTask = async (e) => {
    e.preventDefault()
    if (!token) return

    try {
      const url = editingId
        ? `http://localhost:5000/api/tasks/${editingId}` // Update
        : "http://localhost:5000/api/tasks"             // Create

      const method = editingId ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      })

      // Reset form
      setTitle("")
      setDescription("")
      setStatus("todo")
      setEditingId(null)
      fetchTasks()
    } catch (error) {
      console.error("Failed to submit task:", error)
    }
  }

  // DELETE TASK
  const deleteTask = async (id) => {
    if (!token) return
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchTasks()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  // START EDITING TASK
  const editTask = (task) => {
    setEditingId(task._id)
    setTitle(task.title)
    setDescription(task.description)
    setStatus(task.status)
  }

  // Fetch tasks on page load or page change
  useEffect(() => {
    fetchTasks()
  }, [page])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Manager Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/login"
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create / Edit Task */}
      <form onSubmit={submitTask} className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Task" : "Create Task"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 mb-6">No tasks found. Create a new task.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <p className="mb-2">
                Status: <b>{task.status}</b>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => editTask(task)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-4 mt-8 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>

        <p>
          Page {page} / {totalPages}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}