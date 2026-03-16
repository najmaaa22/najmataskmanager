export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

      <h1 className="text-4xl font-bold mb-6">Task Manager</h1>

      <div className="flex gap-4">

        <a
        href="/login"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        Login
        </a>

        <a
        href="/register"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        Register
        </a>

      </div>

    </div>
  )
}