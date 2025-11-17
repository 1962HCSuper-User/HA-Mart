import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // For redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:1100/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const { token, role } = data;

        // Store JWT and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role); // <-- store user role

        // Redirect based on role (optional)
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/profile"); // seller or regular user

        // Optional: redirect to home after 0.5s
        setTimeout(() => {
          navigate("/"); // replace with your home page route
        }, 500);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In to Your Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-btn">
          Login
        </button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
      <p>
        Forget Password <Link to="/forgot-password">Reset here</Link>
      </p>
    </div>
  );
};

export default Login;
