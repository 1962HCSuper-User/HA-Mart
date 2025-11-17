import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { FaShoppingCart, FaUserCircle, FaSearch, FaUser, FaBox, FaWallet, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Check token on mount + whenever localStorage changes
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin();

    // ✅ Listen for token change from login/logout anywhere in app
    const handleStorageChange = () => checkLogin();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Also run when navigation happens (token might change after redirect)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [navigate]);

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/search?category=${slug}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="nav-top">
        <div className="logo">
          <Link to="/">H-Mart</Link>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="icons">
          <Link to="/inventory">
            <FaShoppingCart className="icon" />
          </Link>

          <div className="profile-container" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <FaUserCircle
                  className="icon profile-icon"
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                {showDropdown && (
                  <div className="profile-dropdown">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                      <FaUser /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setShowDropdown(false)}>
                      <FaBox /> My Orders
                    </Link>
                    <Link to="/wallet" onClick={() => setShowDropdown(false)}>
                      <FaWallet /> Wallet
                    </Link>
                    <Link to="/settings" onClick={() => setShowDropdown(false)}>
                      <FaCog /> Settings
                    </Link>
                    <Link to="/help" onClick={() => setShowDropdown(false)}>
                      <FaQuestionCircle /> Help
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <FaUserCircle className="icon" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="category-bar">
        {[
          { name: "All", slug: "" },
          { name: "Electronics", slug: "electronics" },
          { name: "Fashion", slug: "fashion" },
          { name: "Home", slug: "home" },
          { name: "Beauty", slug: "beauty" },
          { name: "Books", slug: "books" },
          { name: "Toys", slug: "toys" },
        ].map((cat) => (
          <button
            key={cat.slug || "all"}
            onClick={() => handleCategoryClick(cat.slug)}
            className="category-btn"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;