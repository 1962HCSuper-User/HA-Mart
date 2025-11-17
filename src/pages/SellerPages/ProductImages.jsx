import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductImages() {
  const { product_id } = useParams();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  const uploadImages = async () => {
    if (!images.length) return alert("Upload at least 1 image");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    const res = await fetch(
      `http://localhost:1100/api/product-images/${product_id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const result = await res.json();
    setMessage(result.message || "Upload completed");
  };

  return (
    <div className="register-container">
      <h2>📸 Upload Product Images</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

      <div className="preview-box">
        {preview.map((src, i) => (
          <img key={i} src={src} alt="preview" style={{ width: 120 }} />
        ))}
      </div>

      <button onClick={uploadImages}>Upload Images</button>

      {message && <p>{message}</p>}
    </div>
  );
}
