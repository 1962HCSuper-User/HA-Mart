import React, { useState, useEffect } from "react";
import SectionCard from "./SectionCard";

const PersonalInfoPanel = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    bio: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [gender, setGender] = useState("male");

  useEffect(() => {
    if (user) {
      const normalized = {
        fullName: user.fullName || "",
        address: user.address || "",
        phone: user.phone || "",
        bio: user.bio || "",
      };
      setFormData(normalized);
      setInitialData(normalized);
      setGender(user.gender || "male");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiscard = () => {
    if (initialData) {
      setFormData(initialData);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:1100/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, gender }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <SectionCard
      label="Profile"
      title="Personal Information"
      description="Keep your account details up to date for a seamless experience."
    >
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-group">
            <span className="form-label">Full Name</span>
            <input
              type="text"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>
          <label className="form-group">
            <span className="form-label">Phone Number</span>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(405) 555-0128"
            />
          </label>
          <label className="form-group email-field">
            <span className="form-label">Email</span>
            <div className="email-wrapper">
              <input type="email" className="form-control" value={user.email} disabled />
              <span className="verified-badge">Verified</span>
            </div>
          </label>
          <label className="form-group">
            <span className="form-label">Address</span>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              placeholder="3605 Parker Rd."
            />
          </label>
          <label className="form-group form-group-full">
            <span className="form-label">Bio</span>
            <textarea
              name="bio"
              className="form-control textarea"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little more about yourself..."
            />
          </label>
        </div>

        <div className="form-actions stacked-on-mobile">
          <div className="gender-toggle">
            {["male", "female", "other"].map((option) => (
              <button
                type="button"
                key={option}
                className={`toggle-btn ${gender === option ? "active" : ""}`}
                onClick={() => setGender(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={handleDiscard}>
              Discard Changes
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </SectionCard>
  );
};

export default PersonalInfoPanel;