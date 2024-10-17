import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import axios from "axios";
import { loginSuccess } from "../../../redux/admin/adminSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({email:'', password:''})

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    let errors = {};
    let valid = true;
    


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email address';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else {
      if ( 3 > password.length ) {
        errors.password = 'Min 3 characters';
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
        const response = await axios.post("/api/admin/signin", {
          email,
          password,
        });
        
  
        if (response.data.success) {
          dispatch(loginSuccess({ token: response.data.token }));
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
    
  };

  return (
    <div>
      <Navbar />
      <div className="background">
        <div className="p-6 w-full max-w-md containe">
          <div className="text-3xl text-center font-semibold my-7 text-white">Sign In</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="bg-slate-100 p-3 rounded-lg"
            />
            {formError.email && <p className="text-red-700">{formError.email}</p>}

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="bg-slate-100 p-3 rounded-lg"
            />
            {formError.password && <p className="text-red-700">{formError.password}</p>}

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              Sign In
            </button>
          </form>

          <p className="text-red-700 mt-5"></p>
        </div>
      </div>
    </div>
  );
}
