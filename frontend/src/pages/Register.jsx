
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import "../css/Register.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:3000/api/auth/register`, {
                name, email, password
            });

            //Store token and user
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/home");
        } catch (error) {
            console.error("Registration failed", error.response?.data || error.message)
        }
    }

  return (
    <div className="register-container">
        <h2 className="register-header">Register</h2>
        <form onSubmit={handleRegister} className="register-form">
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="register-btn">Register</button>
        </form>
    </div>
  );
}

export default Register