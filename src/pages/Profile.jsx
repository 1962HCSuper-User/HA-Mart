import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Loader from "./Loader";
import PersonalInfo from "./PersonalInfo";
import Cart from "./Cartgui";
import Orders from "./Orders";
import History from "./History";
import Wallet from "./Wallet";
import Transactions from "./Transactions";
import Alerts from "./Alerts";
import Notifications from "./Notifications";
import Settings from "./Settings";
import "./Profile.css";

const menuItems = [
  { label: "Profile", icon: "👤", path: "/profile" },
  { label: "Home", icon: "🏠", path: "/" },
  { label: "Cart", icon: "🛒", path: "/profile/cart" },
  { label: "Order", icon: "📦", path: "/profile/orders" },
  { label: "History", icon: "🕘", path: "/profile/history" },
  { label: "Wallet", icon: "👛", path: "/profile/wallet" },
  { label: "Transactions", icon: "💳", path: "/profile/transactions" },
  { label: "Alert", icon: "🚨", path: "/profile/alerts" },
  { label: "Notification", icon: "📣", path: "/profile/notifications" },
  { label: "Settings", icon: "⚙️", path: "/profile/settings" },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem("token");
    const formDataUpload = new FormData();
    formDataUpload.append("profileImage", file);

    try {
      // FIXED: Use correct endpoint /api/profile/upload-profile
      const res = await fetch("http://localhost:1100/api/profile/upload-profile", {
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

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/profile") {
      return location.pathname === "/profile";
    }
    return location.pathname.startsWith(path);
  };

  const sidebarEntries = useMemo(() => menuItems, []);

  if (!user) return <Loader />;

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <aside className="profile-sidebar">
          <div className="sidebar-brand">
            <span className="brand-icon">C</span>
          </div>
          <nav className="sidebar-menu">
            {sidebarEntries.map((item) => (
              <button
                key={item.label}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                type="button"
                onClick={() => navigate(item.path)}
              >
                <span className="menu-icon" aria-hidden>
                  {item.icon}
                </span>
                <span className="menu-text">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-profile">
              {user.profile_image ? (
                <img
                  src={`http://localhost:1100/${user.profile_image}`}
                  alt="User avatar"
                />
              ) : (
                <div className="sidebar-initials">{getInitials(user.fullName)}</div>
              )}
              <div>
                <p>{user.fullName}</p>
                <span>{user.role || "Customer"}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="profile-main">
          <section className="profile-hero-card">
            <div className="hero-avatar">
              {user.profile_image ? (
                <img
                  src={`http://localhost:1100/${user.profile_image}`}
                  alt="Profile"
                />
              ) : (
                <span className="hero-initials">{getInitials(user.fullName)}</span>
              )}
              <label className="hero-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                  disabled={uploading}
                />
                {uploading ? "Uploading..." : "Change photo"}
              </label>
            </div>
            <div className="hero-summary">
              <h1>{user.fullName}</h1>
              <p>{user.role || "Customer"}</p>
              <div className="hero-meta">
                <span>ID: {user.id}</span>
                <span>{user.email}</span>
              </div>
            </div>
            <button className="hero-logout" onClick={handleLogout}>
              Log out
            </button>
          </section>

          <Routes>
            <Route index element={<PersonalInfo user={user} />} />
            <Route path="cart" element={<Cart navigate={navigate} />} />
            <Route path="orders" element={<Orders navigate={navigate} />} />
            <Route path="history" element={<History />} />
            <Route path="wallet" element={<Wallet navigate={navigate} />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Profile;