import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Login() {
  const [username, setUser] = useState('')
  const [password, setPass] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault(); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center'}}>
      <form onSubmit={submit} style={{width:320, padding:20, border:'1px solid #ddd', borderRadius:6}}>
        <h3 style={{marginBottom:10}}>Login</h3>
        <label>Username</label>
        <input value={username} onChange={e=>setUser(e.target.value)} required style={{width:'100%', marginBottom:8}} />
        <label>Password</label>
        <input value={password} onChange={e=>setPass(e.target.value)} type="password" required style={{width:'100%', marginBottom:12}} />
        <button type="submit" style={{width:'100%'}}>Login</button>
        {error && <div style={{color:'red', marginTop:10}}>{error}</div>}
        <div style={{marginTop:12, fontSize:14, color:'#666'}}>Seeded: <b>patient1/patientpass</b> & <b>doctor1/doctorpass</b></div>
     

      {/* ✅ Registration */}
  <div style={{marginTop:10, fontSize:14, color:'#bbb'}}>
    New user?{" "}
    <span
      style={{color:'skyblue', cursor:'pointer'}}
      onClick={()=>navigate('/register')}
    >
      Register here
    </span>
    </div>

    
      </form>
    </div>

  )
}

