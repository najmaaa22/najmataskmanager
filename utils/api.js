import axios from "axios"

const API = axios.create({
 baseURL: "http://localhost:5000", // ✅ CHANGE THIS
 withCredentials: true
})

export default API