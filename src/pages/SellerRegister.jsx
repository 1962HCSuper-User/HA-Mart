import React, { useState } from "react";
import axios from "axios";
import "./SellerRegister.css";

const SellerRegister = () => {
  const [form, setForm] = useState({
    seller_name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerSeller = async () => {
    try {
      const res = await axios.post("http://localhost:1100/api/seller/register", form);
      setMessage(res.data.message);

      // Clear form after success
      setForm({ seller_name: "", email: "", phone: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="seller-container">
      <h2>Seller Registration</h2>

      <input
        type="text"
        name="seller_name"
        placeholder="Seller Name"
        value={form.seller_name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number (optional)"
        value={form.phone}
        onChange={handleChange}
      />

      <button onClick={registerSeller}>Register</button>

      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default SellerRegister;
