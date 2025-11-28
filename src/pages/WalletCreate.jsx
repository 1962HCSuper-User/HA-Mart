// WalletCreate.jsx - New Wallet Creation/Top-up Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WalletCreate.css"; // Simple styles

const WalletCreate = () => {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch current balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:1100/api/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(response.data.balance || 0);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    };
    fetchBalance();
  }, [navigate]);

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Enter a valid amount");
      return;
    }
    if (pin !== "12345") {
      setMessage("Invalid PIN. Use 12345 for demo.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:1100/api/wallet/topup", {
        amount: parseFloat(amount),
        pin,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(response.data.new_balance || balance + parseFloat(amount));  // Update balance
      setMessage("Top-up successful!");
      setAmount("");
      setPin("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Top-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-page">
      <h1>Wallet</h1>
      <div className="balance-card">
        <h2>Current Balance: ₹{balance.toFixed(2)}</h2>
      </div>
      <form onSubmit={handleTopup} className="topup-form">
        <label>
          Amount to Add:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            placeholder="Enter amount"
            required
          />
        </label>
        <label>
          PIN (Demo: 12345):
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Add to Wallet"}
        </button>
      </form>
      {message && <div className="message">{message}</div>}
      <button onClick={() => navigate("/payment")} className="back-btn">
        Go to Checkout
      </button>
    </div>
  );
};

export default WalletCreate;