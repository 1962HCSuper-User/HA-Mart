// src/pages/ProductVerification.jsx
import React, { useEffect, useState } from "react";
import "./ProductVerification.css";

const ProductVerification = () => {
  const [pending, setPending] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:1100/api/admin/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text(); // may return HTML if 404
        throw new Error(text || "Failed to fetch pending products");
      }

      const data = await res.json();
      setPending(data.products || []);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:1100/api/admin/${action}/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ Product ${action}ed successfully`);
      fetchPending();
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div className="verify-container">
      <h1>🧾 Product Verification (Admin)</h1>
      {pending.length === 0 ? (
        <p>No pending products</p>
      ) : (
        <div className="verify-grid">
          {pending.map((p) => (
            <div key={p.product_id} className="verify-card">
              <img src={`http://localhost:1100/${p.image_path}`} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="btn-group">
                <button onClick={() => handleAction(p.product_id, "approve")}>
                  ✅ Approve
                </button>
                <button onClick={() => handleAction(p.product_id, "reject")}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default ProductVerification;
