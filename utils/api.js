import axios from "axios"

const API = axios.create({
  baseURL: "https://taskmanager-backend-1rgj.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
})

export default API