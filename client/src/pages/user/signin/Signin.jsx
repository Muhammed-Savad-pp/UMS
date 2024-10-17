import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header.jsx";
import "./Signin.css";

export default function Signin() {
  const [formData, setformData] = useState({});
  const [formError, setFormError] = useState({email:'', password:''})
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    let valid = true;
    


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
      if ( 3 > formData.password.length ) {
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
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success == false) {
        dispatch(signInFailure());
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  }
  };

 

  return (
    <div>
      <Header />
      <div className="signin-background">
        <div className="signin-form-container">
          <div className="text-3xl text-center font-semibold my-7 text-white">Sign In</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="email"
              onChange={handleChange}
              id="email"
              className="bg-slate-100 p-3 rounded-lg"
            />
            {formError.email && <p className="text-red-700">{formError.email}</p>}
            <input
              type="password"
              placeholder="Password"
              onChange={handleChange}
              id="password"
              className="bg-slate-100 p-3 rounded-lg"
            />
            {formError.password && <p className="text-red-700">{formError.password}</p>}
            <button
              disabled={loading}
              className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "loading" : "Sign In"}
            </button>
          </form>
          <div className="flex gap-2 mt-5">
            <p className="text-white"> Dont Have an account?..</p>
            <Link to="/sign-up">
              <span className="text-blue-700   underline">Sign Up</span>
            </Link>
          </div>
          <p className="text-red-700 mt-5">
            {error ? error.message || "Something went wrong!" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}