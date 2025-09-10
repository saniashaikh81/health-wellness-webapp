import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Register() {
  const [role, setRole] = useState('patient')
  const [username, setUser] = useState('')
  const [password, setPass] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [guardian, setGuardian] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(''); setMsg('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, name, phone, address, guardian_phone: guardian })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      setMsg(data.message)
      setTimeout(()=> navigate('/'), 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center'}}>
      <form onSubmit={submit} style={{width:350, padding:20, border:'1px solid #ddd', borderRadius:6}}>
        <h3 style={{marginBottom:10}}>Register</h3>

        <label>Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%', marginBottom:8}}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <label>Username</label>
        <input value={username} onChange={e=>setUser(e.target.value)} required style={{width:'100%', marginBottom:8}} />

        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPass(e.target.value)} required style={{width:'100%', marginBottom:8}} />

        {role === 'patient' && (
          <>
            <label>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', marginBottom:8}} />
            <label>Phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%', marginBottom:8}} />
            <label>Address</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} style={{width:'100%', marginBottom:8}} />
            <label>Guardian Phone</label>
            <input value={guardian} onChange={e=>setGuardian(e.target.value)} style={{width:'100%', marginBottom:8}} />
          </>
        )}

        <button type="submit" style={{width:'100%'}}>Register</button>
        {msg && <div style={{color:'green', marginTop:10}}>{msg}</div>}
        {error && <div style={{color:'red', marginTop:10}}>{error}</div>}

        <div style={{marginTop:10, fontSize:14, color:'#555'}}>
          Already have account? <span style={{color:'blue', cursor:'pointer'}} onClick={()=>navigate('/')}>Login</span>
        </div>
      </form>
    </div>
  )
}
