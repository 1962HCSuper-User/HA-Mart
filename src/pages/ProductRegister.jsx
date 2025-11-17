import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./ProductRegister.css";

const ProductRegister = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const watchedImage = watch("image");
  const basePrice = watch("base_price");
  const discount = watch("discount");
  const discountedPrice =
    basePrice && discount
      ? (basePrice - (basePrice * discount) / 100).toFixed(2)
      : basePrice;

  // 🔹 Image preview
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(watchedImage[0]);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  // ✅ Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    // Format tags
    const tagsArray = data.tags
      ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

    // Format colours
    const coloursArray = data.colours
      ? data.colours.split(",").map((clr) => clr.trim()).filter(Boolean)
      : ["#ffffff", "#000000"];

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("title", data.title || data.name); // ✅ Ensure title always exists
    formData.append("description", data.description || "");
    formData.append("tags", JSON.stringify(tagsArray));
    formData.append("type", data.type);
    formData.append("base_price", data.base_price);
    formData.append("discount", data.discount || 0);
    formData.append("category_id", data.category_id);
    formData.append("colours", JSON.stringify(coloursArray));
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:1100/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Product registered successfully! ID: ${result.product_id}`);
        reset();
        setImagePreview(null);
        navigate(`/product-details/${result.product_id}`);
      } else {
        setMessage(`❌ Error: ${result.error || "Failed to register product"}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🛍 Register New Product</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Product Name */}
          <input
            type="text"
            placeholder="Product Name"
            {...register("name", { required: true })}
          />
          {errors.name && <p className="error">Product name is required</p>}

          {/* Product Title */}
          <input
            type="text"
            placeholder="Product Title (short catchy title)"
            {...register("title", { required: true })}
          />
          {errors.title && <p className="error">Product title is required</p>}

          {/* Description */}
          <textarea placeholder="Description" {...register("description")} />

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            {...register("tags")}
          />

          {/* Type */}
          <select {...register("type", { required: true })}>
            <option value="">Select Type</option>
            <option value="cloth">Cloth</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home</option>
            <option value="grocery">Grocery</option>
          </select>

          {/* Base Price */}
          <input
            type="number"
            placeholder="Base Price"
            step="0.01"
            {...register("base_price", { required: true, min: 0.01 })}
          />
          {basePrice && (
            <p className="discount-preview">
              Price after discount: ₹{discountedPrice}
            </p>
          )}

          {/* Discount */}
          <input
            type="number"
            placeholder="Discount %"
            step="0.01"
            min="0"
            max="100"
            {...register("discount")}
          />

          {/* Category ID */}
          <input
            type="number"
            placeholder="Category ID"
            {...register("category_id", { required: true, min: 1 })}
          />

          {/* Colours */}
          <input
            type="text"
            placeholder='Colours (comma separated, e.g. "#1e1e1e,#fafafa,#2c2c2c")'
            {...register("colours")}
          />

          {/* Image */}
          <input type="file" accept="image/*" {...register("image")} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Product"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ProductRegister;
