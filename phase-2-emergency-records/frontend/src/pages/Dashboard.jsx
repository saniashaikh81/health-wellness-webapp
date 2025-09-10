import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Dashboard(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [lastPatient, setLastPatient] = useState(null)
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  useEffect(() => {
    if(!user){
      navigate('/login')
    }
    if(user && user.role === 'doctor'){
      fetch(`${API_BASE}/api/patient/last`,{
        headers:{'Authorization': 'Bearer '+localStorage.getItem('token')}
      }).then(res=>res.json()).then(setLastPatient)
    }
  }, [user, navigate])

  if (!user) return null;

  const handleSearch = async () => {
    if(!searchId) return
    const res = await fetch(`${API_BASE}/api/patient/${searchId}`, {
      headers:{'Authorization': 'Bearer '+localStorage.getItem('token')}
    })
    const data = await res.json()
    setSearchResult(data)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const renderPatientCard = (p) => (
    <div style={{border:'1px solid #ddd', padding:10, marginTop:10}}>
      <b>{p.name}</b> (ID: {p.id})<br/>
      Phone: {p.phone}<br/>
      Address: {p.address}<br/>
      <button onClick={()=>navigate(`/patient/${p.id}`)}>View Details</button>
    </div>
  )

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Welcome, {user.username} ({user.role})</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{marginTop:20}}>
        <button onClick={()=>navigate('/emergency')} style={{marginRight:10, padding:'10px 16px'}}>Emergency 🚨</button>
        <button onClick={()=>alert('Patient details page not implemented yet — next step')} style={{padding:'10px 16px'}}>Patient details</button>
      </div>

      <div style={{marginTop:20, color:'#666'}}>
        Note: These buttons are placeholders for the next step (we will implement actual pages after login).
      </div>
    </div>
  )
}
