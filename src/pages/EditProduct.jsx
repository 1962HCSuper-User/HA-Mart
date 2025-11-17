import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1100/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Product not found");

      const data = await response.json();
      setProduct(data);
      setImagePreview(`http://localhost:1100/${data.image_path}`);
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("Updating...");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      for (const key in product) {
        if (key !== "image_path") formData.append(key, product[key]);
      }
      if (product.image) formData.append("image", product.image);

      const response = await fetch(`http://localhost:1100/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Product updated successfully!");
        setTimeout(() => navigate("/inventory"), 1500);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>{message || "Product not found"}</p>;

  return (
    <div className="edit-container">
      <h2>🛠 Edit Product</h2>
      <form onSubmit={handleUpdate} className="edit-form">
        <label>
          Product Name:
          <input name="name" value={product.name} onChange={handleChange} />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Base Price:
          <input
            type="number"
            name="base_price"
            value={product.base_price}
            onChange={handleChange}
          />
        </label>

        <label>
          Discount (%):
          <input
            type="number"
            name="discount"
            value={product.discount || 0}
            onChange={handleChange}
          />
        </label>

        <label>
          Category ID:
          <input
            type="number"
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
          />
        </label>

        <label>
          Tags (comma separated):
          <input
            name="tags"
            value={Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Image:
          <input type="file" onChange={handleImageChange} />
        </label>

        {imagePreview && <img src={imagePreview} alt="Preview" className="preview-img" />}

        <button type="submit" className="btn-update">
          💾 Save Changes
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default EditProduct;
