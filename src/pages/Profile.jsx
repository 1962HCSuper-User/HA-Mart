import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Assuming Loader is in a separate file; adjust path as needed
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:1100/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          setFormData({
            fullName: data.user.fullName || "",
            address: data.user.address || "",
            phone: data.user.phone || "",
            bio: data.user.bio || "",
          });
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile edits
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:1100/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setUser({ ...user, ...formData });
        setEditing(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Upload profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem("token");
    const formDataUpload = new FormData();
    formDataUpload.append("profileImage", file);

    try {
      const res = await fetch("http://localhost:1100/api/upload-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });
      const data = await res.json();

      if (res.ok) {
        alert("Profile image updated successfully!");
        setUser((prev) => ({ ...prev, profile_image: data.path }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
    setUploading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <Loader />;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1 className="profile-title">Welcome, {user.fullName}</h1>
        <p className="profile-subtitle">
          Manage your account information and settings below.
        </p>
      </header>

      <div className="profile-content">
        <section className="profile-image-section">
          <div className="image-wrapper">
            {user.profile_image ? (
              <img
                src={`http://localhost:1100/${user.profile_image}`}
                alt="Profile"
                className="profile-img"
              />
            ) : (
              <div className="image-placeholder">
                <svg
                  className="placeholder-icon"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="32" r="32" fill="#e2e8f0" />
                  <path
                    d="M32 18C27.0294 18 23 22.0294 23 27C23 32.5243 27.0294 37 32 37C36.9706 37 41 32.5243 41 27C41 22.0294 36.9706 18 32 18Z"
                    stroke="#a0aec0"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M16 44C16 40.6863 27.9129 37 32 37C36.0871 37 48 40.6863 48 44V46C48 47.1046 47.1046 48 46 48H18C16.8954 48 16 47.1046 16 46V44Z"
                    stroke="#a0aec0"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                  />
                </svg>
                <p>No Image</p>
              </div>
            )}
            <label className="upload-label">
              {uploading ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
        </section>

        <section className="profile-info-section">
          <div className="profile-card">
            <header className="card-header">
              <h2 className="card-title">User Information</h2>
              <div className="card-actions">
                {editing ? (
                  <button className="btn btn-save" onClick={handleSave}>
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="btn btn-edit"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
                <button className="btn btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </header>

            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">User ID</label>
                <div className="info-value">{user.id}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Full Name</label>
                <div className="info-value editable">
                  {editing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    user.fullName
                  )}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Email</label>
                <div className="info-value">{user.email}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Address</label>
                <div className="info-value editable">
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    user.address || "Not Provided"
                  )}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Phone</label>
                <div className="info-value editable">
                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    user.phone || "Not Provided"
                  )}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Bio</label>
                <div className="info-value editable">
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="textarea-field"
                      rows={3}
                    />
                  ) : (
                    user.bio || "Not Provided"
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
