// src/pages/AdminPages/AdminPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-panel-container">
      <h1>🛠 Admin Dashboard</h1>
      <div className="admin-panel-grid">
        <div
          className="admin-card"
          onClick={() => handleNavigate("/admin/product-verification")}
        >
          <h2>Product Verification</h2>
          <p>Approve or reject products submitted by sellers</p>
        </div>

        <div
          className="admin-card"
          onClick={() => handleNavigate("/admin/role-change")}
        >
          <h2>Change User Role</h2>
          <p>Assign admin or seller roles to users</p>
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
