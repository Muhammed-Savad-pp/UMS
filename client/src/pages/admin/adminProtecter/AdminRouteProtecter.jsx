import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

export default function AdminRouteProtecter() {
  
    const isLoggin = useSelector(state => state.adminAuth.isLoggin);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggin){
            navigate('/admin/login')
        }
    }, [])
  
    return isLoggin ? <Outlet/> : null
    
}
