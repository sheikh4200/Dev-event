"use client"

import { useState } from "react"



const BookEvent = () => {

const [email,setEmail] = useState('')
const [submitted,setSubmitted] = useState(false)

const handleSubmit = (e: React.FormEvent)=>{
e.preventDefault()
setTimeout(() => {
  setSubmitted(true)
}, 1000);
}

  return (
   <>
    <div id="book-event">
    {
      submitted ? (
        <p className="text-[#115533]">Thank you For Signing up</p>
      ) :(
        <form onSubmit={handleSubmit}>
           <div>
      <label className="mt-2 ml-1 text-1x1" htmlFor="email">Email Address</label>
      <input className="border-2 border-[#115533] " type="email" value={email} onChange={(e)=> setEmail(e.target.value)} 
      id="email"
      placeholder="Enter Your Email Address"
      />

       </div>
       <button type="submit" className="button-submit">Submit</button>
        </form>
      )
    }  
      
    </div>
    </>
  )
}

export default BookEvent