import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductEdit.css";

const ProductEdit = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [product_id]);

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1100/api/products/${product_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await response.json();
      if (response.ok) setProduct(result.product);
      else setMessage(result.error || "Failed to fetch product details");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1100/api/products/${product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("✅ Product updated successfully!");
        navigate("/inventory");
      } else {
        setMessage(result.error || "Update failed");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>{message || "Product not found"}</p>;

  return (
    <div className="edit-container">
      <h1>Edit Product: {product.name}</h1>

      <div className="edit-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={product.name || ""}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
        />

        <label>Base Price</label>
        <input
          type="number"
          name="base_price"
          value={product.base_price || ""}
          onChange={handleChange}
        />

        <label>Discount (%)</label>
        <input
          type="number"
          name="discount"
          value={product.discount || ""}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={product.status || "inactive"}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="rejected">Rejected</option>
        </select>

        <button onClick={handleUpdate} className="btn-save">
          💾 Save Changes
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProductEdit;
