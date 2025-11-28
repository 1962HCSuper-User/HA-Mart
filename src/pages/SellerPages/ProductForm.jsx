import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:1100/api/ProductsVerification";

export default function ProductForm() {
  const [form, setForm] = useState({
    product_name: "",
    product_title: "",
    tags: "",
    color_options: "",
    product_variant_ids: "",
    manufacturer: "",
    type: "",
    brand: "",
    size: "",
    gender: "",
    target_age_range: "",
    target_audience: "",
    sku_id: "",
    stock: "",
    available_states: "",
    shipping_charge: "",
    delivery_time: "",
    cash_on_delivery: "",
    return_policy: "",
    price: "",
    discount_percentage: "",
    after_discount_price: "",
    special_deal: "",
    limited_time_offer: "",
    offer_description: "",
    most_sale_duration: "",
    gst_included: "",
    gst_percentage: "",
    seo_keywords: "",
    seo_title: "",
    notes: "",
    collection_item: "",
    reviews: "",
    what_is_in_box: "",
    product_information_file: "",
    product_description_file: "",
    additional_information_file: "",
    sellerName: "",
    imageFolder: "gallery",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [productId, setProductId] = useState("");

  // ---------------- Handle Text Fields ----------------
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ---------------- Handle Images ----------------
  function handleImage(e) {
    const files = Array.from(e.target.files);

    if (files.length > 8) {
      alert("You can upload only 8 images!");
      return;
    }

    setImages(files);

    // Preview Images
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  }

  // ---------------- Format JSON Fields ----------------
  function formatJSONField(fieldName) {
    try {
      const obj = JSON.parse(form[fieldName]);
      alert(`${fieldName} JSON is valid!`);
      setForm({ ...form, [fieldName]: JSON.stringify(obj) });
    } catch {
      alert("Invalid JSON format. Please enter valid JSON.");
    }
  }

  // ---------------- INSERT PRODUCT ----------------
  async function insertProduct() {
    try {
      const fd = new FormData();

      for (let key in form) {
        fd.append(key, form[key]);
      }

      images.forEach((file) => fd.append("images", file));

      const res = await axios.post(API, fd);

      alert("Product Added Successfully!");
      setProductId(res.data.product_id);

      // Reset Form
      setForm({
        ...form,
        product_name: "",
        product_title: "",
        tags: "",
        color_options: "",
        product_variant_ids: "",
        manufacturer: "",
        type: "",
        brand: "",
        size: "",
        gender: "",
        target_age_range: "",
        target_audience: "",
        sku_id: "",
        stock: "",
        available_states: "",
        shipping_charge: "",
        delivery_time: "",
        cash_on_delivery: "",
        return_policy: "",
        price: "",
        discount_percentage: "",
        after_discount_price: "",
        special_deal: "",
        limited_time_offer: "",
        offer_description: "",
        most_sale_duration: "",
        gst_included: "",
        gst_percentage: "",
        seo_keywords: "",
        seo_title: "",
        notes: "",
        collection_item: "",
        reviews: "",
        what_is_in_box: "",
        product_information_file: "",
        product_description_file: "",
        additional_information_file: "",
        sellerName: "",
        imageFolder: "gallery",
      });

      setImages([]);
      setPreview([]);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ---------------- UPDATE PRODUCT ----------------
  async function updateProduct() {
    if (!productId) return alert("Enter Product ID");

    try {
      const fd = new FormData();
      for (let key in form) fd.append(key, form[key]);
      images.forEach((file) => fd.append("images", file));

      await axios.put(`${API}/${productId}`, fd);
      alert("Product Updated Successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ---------------- DELETE PRODUCT ----------------
  async function deleteProduct() {
    if (!productId) return alert("Enter Product ID");

    try {
      await axios.delete(`${API}/${productId}`);
      alert("Product Deleted Successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ---------------- SEARCH PRODUCT ----------------
  async function searchProduct() {
    if (!productId) return alert("Enter Product ID");

    try {
      const res = await axios.get(`${API}/${productId}`);

      alert("Product Loaded!");

      setForm({
        ...form,
        ...res.data.product,
      });
    } catch {
      alert("Product Not Found");
    }
  }

  // ---------------- UI ----------------
  return (
    <div style={{ width: "85%", margin: "auto", padding: 30 }}>
      <h1 style={{ marginBottom: 20 }}>Admin Panel – Product Form</h1>

      {/* Dynamic Inputs */}
      <div className="grid">
        {Object.keys(form).map((key) =>
          key !== "imageFolder" && key !== "sellerName" ? (
            <div key={key} style={{ marginBottom: 12 }}>
              <label>{key.replace(/_/g, " ").toUpperCase()}</label>
              <textarea
                name={key}
                value={form[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: 7,
                  minHeight: ["product_information_file", "product_description_file", "additional_information_file", "seo_keywords", "seo_title"].includes(key)
                    ? "100px"
                    : "40px",
                }}
              />
              {["product_information_file", "product_description_file", "additional_information_file", "seo_keywords", "seo_title"].includes(key) && (
                <button
                  onClick={() => formatJSONField(key)}
                  style={{ marginTop: 6, padding: "4px 10px", background: "black", color: "white", border: "none" }}
                >
                  Validate JSON
                </button>
              )}
            </div>
          ) : null
        )}

        {/* Seller Name */}
        <div style={{ marginBottom: 12 }}>
          <label>Seller Name</label>
          <input
            name="sellerName"
            value={form.sellerName}
            onChange={handleChange}
            style={{ width: "100%", padding: 6 }}
          />
        </div>

        {/* Image Folder */}
        <div style={{ marginBottom: 12 }}>
          <label>Image Folder (gallery, thumbnail)</label>
          <input
            name="imageFolder"
            value={form.imageFolder}
            onChange={handleChange}
            style={{ width: "100%", padding: 6 }}
          />
        </div>

        {/* Images */}
        <div style={{ marginBottom: 12 }}>
          <label>Upload Images (Max 8)</label>
          <input type="file" multiple onChange={handleImage} />
        </div>

        {/* Preview */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {preview.map((src, i) => (
            <img key={i} src={src} width={100} height={100} style={{ borderRadius: 6, border: "1px solid #999" }} />
          ))}
        </div>

        {/* Product ID */}
        <div style={{ marginBottom: 12 }}>
          <label>Product ID</label>
          <input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{ width: "100%", padding: 6 }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 20 }}>
        <button onClick={insertProduct} style={btnStyle}>Insert</button>
        <button onClick={updateProduct} style={btnStyle}>Update</button>
        <button onClick={deleteProduct} style={btnStyle}>Delete</button>
        <button onClick={searchProduct} style={btnStyle}>Search</button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  marginRight: "10px",
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
};
