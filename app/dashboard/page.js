"use client"

import { useEffect, useState } from "react"
import API from "../../utils/api"
import { useRouter } from "next/navigation"

export default function Dashboard() {

  const router = useRouter()

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [editingId, setEditingId] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  // ✅ FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await API.get(`/api/v1/tasks?page=${page}`, {
        withCredentials: true
      })

      setTasks(res.data.data || [])
      setTotalPages(res.data.totalPages || 1)

    } catch (error) {

      console.error("Auth failed → redirecting")
      router.push("/login")

    }
  }


  // ✅ CREATE / UPDATE TASK
  const submitTask = async (e) => {

    e.preventDefault()

    try {

      if (editingId) {

        await API.put(
          `/api/v1/tasks/${editingId}`,
          { title, description, status },
          { withCredentials: true }
        )

      } else {

        await API.post(
          `/api/v1/tasks`,
          { title, description, status },
          { withCredentials: true }
        )

      }

      setTitle("")
      setDescription("")
      setStatus("todo")
      setEditingId(null)

      fetchTasks()

    } catch (error) {
      console.error("Submit failed:", error)
    }
  }


  // ✅ DELETE TASK
  const deleteTask = async (id) => {

    try {

      await API.delete(`/api/v1/tasks/${id}`, {
        withCredentials: true
      })

      fetchTasks()

    } catch (error) {
      console.error("Delete failed:", error)
    }
  }


  // ✅ EDIT TASK
  const editTask = (task) => {
    setEditingId(task._id)
    setTitle(task.title)
    setDescription(task.description)
    setStatus(task.status)
  }


  // ✅ LOAD TASKS
  useEffect(() => {
    fetchTasks()
  }, [page])


  return (

    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Task Manager Dashboard
        </h1>

        <button
          onClick={async () => {

            await API.post("/api/v1/auth/logout", {}, {
              withCredentials: true
            })

            router.push("/login")

          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>


      {/* FORM */}
      <form
        onSubmit={submitTask}
        className="bg-white p-6 rounded shadow mb-8"
      >

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


      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 mb-6">
          No tasks found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {tasks.map((task) => (

            <div key={task._id} className="bg-white p-4 rounded shadow">

              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <p>Status: <b>{task.status}</b></p>

              <div className="flex gap-3 mt-2">

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


      {/* PAGINATION */}
      <div className="flex gap-4 mt-8 items-center">

        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>

        <p>Page {page} / {totalPages}</p>

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