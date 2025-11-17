// src/pages/AdminPages/AdminPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./SellerPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-panel-container">
      <h1>🛠 Seller Dashboard</h1>
      <div className="admin-panel-grid">
        <div
          className="admin-card"
          onClick={() => handleNavigate("/inventory")}
        >
          <h2>Inventory</h2>
          <p>The Product That you upload in the inventort</p>
        </div>

        <div
          className="admin-card"
          onClick={() => handleNavigate("/product-register")}
        >
          <h2>Register Product </h2>
          <p>Register a new Product</p>
        </div>

        {/* Future Admin Pages */}
        <div
          className="admin-card"
          onClick={() => handleNavigate("/admin/other-page")}
        >
          <h2>Other Admin Page</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
