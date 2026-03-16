"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register(){

const router = useRouter()

const [form,setForm] = useState({
name:"",
email:"",
password:""
})

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async(e)=>{
e.preventDefault()

const res = await fetch(
  "https://taskmanager-backend-1rgj.onrender.com/api/auth/register",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(form)
  }
)

const data = await res.json()

alert(data.message)

router.push("/login")

}

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">

<h2 className="text-2xl mb-4 text-center">Register</h2>

<input
name="name"
placeholder="Name"
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<button className="bg-blue-500 text-white w-full p-2 rounded">
Register
</button>

</form>

</div>

)

}