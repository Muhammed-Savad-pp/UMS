import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../../redux/admin/adminSlice.js'
import '../Navbar/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleSignOut = () => {
      localStorage.removeItem('adminToken');
      dispatch(logout());
      navigate('/admin/login')
   
  }
  return (
    <div className='main-div'>
    <div>
      <p className='text-white font-bold text-2xl'>WELCOME ADMIN</p>
    </div>
    <div className='btn-div'>
      <button onClick={handleSignOut}>Logout</button>
    </div>
  </div>
  )
}
