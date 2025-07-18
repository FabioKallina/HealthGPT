
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../css/Login.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
    }
  };

    return (
        <div className="login-container">
            <h2 className="login-header">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-btn">Login</button>
                <p className="login-text">Not signed up yet? Sign up <a href="/register">here</a></p>
            </form>
        </div>
    );
}

export default Login;