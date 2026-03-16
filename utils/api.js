import axios from "axios"

const API = axios.create({
  baseURL: "https://taskmanager-backend-1rgj.onrender.com"|| process.env.NEXT_PUBLIC_API_URL,
  withCredentials:true,
  headers: {
    "Content-Type": "application/json"
  }
})

export default API