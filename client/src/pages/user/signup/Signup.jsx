import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import "./Signup.css";

export default function Signup() {
  const [formData, setformData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFromError] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    let valid = true;

    if (!formData.username) {
      errors.username = "Username is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
      valid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      valid = false;
    } else {
      if (3 > formData.password.length) {
        errors.password = "Min 3 characters";
        valid = false;
      }
    }
    setFromError(errors);
    return valid;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success == false) {
          setError(true);
          return;
        }
        navigate("/sign-in");
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="signup-background">
        <div className="signup-form-container">
          <div className="text-3xl text-center font-semibold my-7 text-white">
            SignUp
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              onChange={handleChange}
              id="username"
              className="bg-slate-100 p-3 rounded-lg"
            />
            {formError.username && <p className="text-red-700">{formError.username}</p>}
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
              className="bg-slate-700 text-white p-3 rounded-lg uppercase
                hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "loading" : "Sign Up"}
            </button>
          </form>
          <div className="flex gap-2 mt-5">
            <p className="text-white">Have an account?</p>
            <Link to="/sign-in">
              <span className="text-blue-500 underline">Sign In</span>
            </Link>
          </div>
          <p className="text-red-700 mt-5">
            {error && "Something went wrong!"}
          </p>
        </div>
      </div>
    </div>
  );
}
