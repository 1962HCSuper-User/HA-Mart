// WalletCreate.jsx - Create Wallet + Top-up Page (Dynamic PIN)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WalletCreate.css";

const WalletCreate = () => {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [balance, setBalance] = useState(0);
  const [walletExists, setWalletExists] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // -------- CHECK WALLET EXISTS + FETCH BALANCE --------
  useEffect(() => {
    const initWallet = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:1100/api/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.balance === undefined) {
          setWalletExists(false);
        } else {
          setWalletExists(true);
          setBalance(parseFloat(res.data.balance) || 0);
        }
      } catch (err) {
        console.log("Wallet not created");
        setWalletExists(false);
      }
    };

    initWallet();
  }, [navigate]);

  // -------- CREATE WALLET FIRST TIME --------
  const handleCreateWallet = async (e) => {
    e.preventDefault();

    if (newPin.length < 4) {
      setMessage("PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setMessage("PIN does not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:1100/api/wallet/create",
        { pin: newPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Wallet created successfully!");
      setWalletExists(true);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  // -------- TOPUP WALLET --------
  const handleTopup = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Enter a valid amount");
      return;
    }

    if (!pin) {
      setMessage("Enter your PIN");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:1100/api/wallet/topup",
        {
          amount: parseFloat(amount),
          pin: pin,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(balance + parseFloat(amount));
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

      {/* ---------- CREATE WALLET UI (IF WALLET NOT EXISTS) ---------- */}
      {!walletExists ? (
        <div className="create-wallet-card">
          <h2>Create Your Wallet</h2>

          <form onSubmit={handleCreateWallet} className="topup-form">
            <label>
              Enter New PIN:
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                minLength={4}
                required
              />
            </label>

            <label>
              Confirm PIN:
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                minLength={4}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Wallet"}
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </div>
      ) : (
        <>
          {/* ---------- WALLET BALANCE ---------- */}
          <div className="balance-card">
            <h2>Current Balance: ₹{balance.toFixed(2)}</h2>
          </div>

          {/* ---------- TOPUP FORM ---------- */}
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
              Enter PIN:
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Add Money"}
            </button>
          </form>

          {message && <div className="message">{message}</div>}

          <button onClick={() => navigate("/payment")} className="back-btn">
            Go to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default WalletCreate;
