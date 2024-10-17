import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './createuser.css'


export default function CreateUser() {

    const [formData, setFormData] = useState({})
    const [formError, setFormError] = useState({username:'', email:'', password:''})

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }
    const validate = () => {
        let errors = {};
        let valid = true;
        
    
        if (!formData.username) {
          errors.username = 'Username is required';
          valid = false;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
          errors.email = 'Email is required';
          valid = false;
        } else if (!emailRegex.test(formData.email)) {
          errors.email = 'Invalid email address';
          valid = false;
        }
    
        if (!formData.password) {
          errors.password = 'Password is required';
          valid = false;
        } else {
          if ( 2 > formData.password.length ) {
            errors.password = 'Min 6 characters';
            valid = false;
          }
         
        }    
        setFormError(errors);
        return valid;
      };
    

    const handleSubmit = async (e) => {     
        e.preventDefault();
        if(validate()){
            try {  
                const token = localStorage.getItem('adminToken');
                const response = await axios.post('/api/admin/create-user', formData,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if(response.data.success){
                    navigate('/admin/dashboard');
                }else{
                    console.log('user not created');
                    
                }
            } catch (error) {
                console.log(error);
                
            }
        }   
    }
   
    
  return (
    <div >
  <Navbar />
  <div className="background">
  <div className="p-3">
    <div className="text-3xl text-center font-semibold my-4 ">
      Create User
    </div>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ml-4">
      <input
        type="text"
        placeholder="Username"
        id="username"
        className="bg-slate-100 p-3 rounded-lg"
        onChange={handleChange}
      />
      {formError.username && <p className="error">{formError.username}</p>}

      <input
        type="email"
        placeholder="email"
        id="email"
        className="bg-slate-100 p-3 rounded-lg"
        onChange={handleChange}
      />
      {formError.email && <p className="error">{formError.email}</p>}

      <input
        type="password"
        placeholder="Password"
        id="password"
        className="bg-slate-100 p-3 rounded-lg"
        onChange={handleChange}
      />
      {formError.password && <p className="error">{formError.password}</p>}

      <button type="submit" className="bg-slate-700 text-white p-3 rounded-lg">
        Save
      </button>
    </form>
  </div>
  </div>
</div>

  );
}
