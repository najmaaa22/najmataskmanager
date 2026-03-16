import axios from "axios"

const API = axios.create({
  baseURL: "https://taskmanager-backend-1rgj.onrender.com/api",
  withCredentials: true
})

export default API