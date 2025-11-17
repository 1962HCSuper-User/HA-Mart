import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1100/api/product-details/${product_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Product details saved!");
        setTimeout(() => navigate("/inventory"), 1000);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>🛠 Fill Product Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Color" {...register("color", { required: true })} />
        {errors.color && <p>Required</p>}

        <input type="text" placeholder="Size" {...register("size", { required: true })} />
        {errors.size && <p>Required</p>}

        <input type="text" placeholder="Gender" {...register("gender")} />
        <input type="text" placeholder="Material" {...register("material")} />
        <input type="text" placeholder="Quality" {...register("quality")} />
        <input type="number" placeholder="Quantity" {...register("quantity", { required: true, min: 0 })} />
        <input type="text" placeholder="SKU" {...register("sku")} />

        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Details"}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductDetails;
