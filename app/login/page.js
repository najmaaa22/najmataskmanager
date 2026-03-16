"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "../../utils/api"

export default function Login(){

const router = useRouter()

const [form,setForm] = useState({
email:"",
password:""
})

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async(e)=>{
e.preventDefault()

try{

const res = await API.post("/api/auth/login",form)

localStorage.setItem("token",res.data.token)

router.push("/dashboard")

}catch(error){

console.error("Login failed:",error)
alert("Invalid credentials")

}

}

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">

<h2 className="text-2xl mb-4 text-center">Login</h2>

<input
name="email"
placeholder="Email"
onChange={handleChange}
className="border p-2 w-full mb-3"
required
/>

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
className="border p-2 w-full mb-3"
required
/>

<button className="bg-green-500 text-white w-full p-2 rounded">
Login
</button>

</form>

</div>

)

}