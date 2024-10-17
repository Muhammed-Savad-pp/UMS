import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {Outlet, useNavigate} from 'react-router-dom'

export default function AdminLoginProtector() {
    const navigate = useNavigate();
    const isLoggin = useSelector(state => state?.adminAuth?.isLoggin);
    
    useEffect(() => {
      if(isLoggin){
        navigate('/admin/dashboard')
      }
    },[isLoggin, navigate]);

    return !isLoggin ? < Outlet/> : null
    
}
