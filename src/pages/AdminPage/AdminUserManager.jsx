import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaUserShield, FaSearch } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import "./AdminUserManager.css";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:1100/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while fetching users.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmail(query);
    setFilteredUsers(users.filter((u) => u.email.toLowerCase().includes(query)));
  };

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Change this user role to ${newRole}?`)) return;
    try {
      const res = await fetch(
        `http://localhost:1100/api/admin/change-role/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(
        `http://localhost:1100/api/admin/delete-user/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully");
        setUsers(users.filter((u) => u.id !== id));
        setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      className="admin-user-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="admin-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MdAdminPanelSettings className="admin-icon" /> User Management
      </motion.h1>

      <motion.div
        className="search-bar"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search user by email..."
          value={searchEmail}
          onChange={handleSearch}
        />
      </motion.div>

      {loading ? (
        <div className="loading-shimmer">Loading users...</div>
      ) : (
        <motion.div
          className="user-table-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="role-btn"
                        onClick={() =>
                          handleRoleChange(
                            user.id,
                            user.role === "admin" ? "seller" : "admin"
                          )
                        }
                      >
                        <FaUserShield /> Change Role
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminUserManager;
