import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Inventory.css";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("http://localhost:1100/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setProducts(result.products || []);
        setMessage("");
      } else {
        setMessage(result.error || "Failed to fetch products");
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (product_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1100/api/product/submit/${product_id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Product submitted for admin approval!");
        fetchProducts(); // refresh after submission
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">📦 My Inventory</h1>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="empty-inventory">
          <p>No products found. Register a new one!</p>
          <Link to="/product-register" className="btn-new">
            ➕ Register Product
          </Link>
        </div>
      ) : (
        <div className="inventory-grid">
          {products.map((prod) => {
            const priceAfterDiscount = Number(prod.total_amt_after_discount || 0);
            const discount = Number(prod.discount || 0);

            return (
              <div key={prod.product_id} className="product-card">
                <img
                  src={`http://localhost:1100/${prod.image_path}`}
                  alt={prod.name}
                  className="product-img"
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
                <div className="product-info">
                  <h3>{prod.name}</h3>
                  <p className="description">
                    {prod.description ? prod.description : "No description"}
                  </p>

                  <p className="price">
                    ₹{priceAfterDiscount.toFixed(2)}{" "}
                    {discount > 0 && (
                      <span className="discount">(-{discount}%)</span>
                    )}
                  </p>

                  <p
                    className={`status ${
                      prod.status === "active"
                        ? "active"
                        : prod.status === "inactive"
                        ? "inactive"
                        : prod.status === "pending"
                        ? "pending"
                        : "rejected"
                    }`}
                  >
                    {prod.status ? prod.status.toUpperCase() : "UNKNOWN"}
                  </p>

                  <div className="button-group">
                    <Link
                      to={`/product-edit/${prod.product_id}`}
                      className="btn-edit"
                    >
                      🛠 Edit Details
                    </Link>

                    {prod.status === "inactive" && (
                      <button
                        className="btn-submit"
                        onClick={() => handleSubmitForApproval(prod.product_id)}
                      >
                        🚀 Submit for Approval
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Inventory;
