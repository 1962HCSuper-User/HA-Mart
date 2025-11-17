import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ mode = "add", productData = {} }) {
  const [form, setForm] = useState({
    seller_id: "",
    title: "",
    product_name: "",
    price: "",
    discount_price: "",
    discount: "",
    colour: "",
    size: "",
    categories_id: "",
    category_type: "",
    package_item: "",
    deals: "",
    offer: "",
    stocks: "",
    sku_id: "",
    sku_name: "",
    targeted_audience: "",
    targeted_age: "",
    badge: "",
    special_duration: "",
    offer_time: "",
    season: "",

    // TEXT FILE INPUTS
    description_text: "",
    technical_details_text: "",
    additional_info_text: "",
    reviews_text: "",
  });

  // When editing, fill existing data
  useEffect(() => {
    if (mode === "edit" && productData) {
      setForm({ ...form, ...productData });
    }
  }, [productData]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWT Token

      const url =
        mode === "add"
          ? "/api/products/add"
          : `/api/products/update/${productData.product_id}`;

      const response = await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(
        mode === "add"
          ? "Product Registered Successfully!"
          : "Product Updated Successfully!"
      );

      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {mode === "add" ? "Register New Product" : "Update Product"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Seller ID */}
        <div>
          <label className="block mb-1 font-semibold">Seller ID</label>
          <input
            type="number"
            name="seller_id"
            value={form.seller_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title (max 150)</label>
          <input
            type="text"
            name="title"
            value={form.title}
            maxLength="150"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block mb-1 font-semibold">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* DISCOUNT PRICE */}
        <div>
          <label className="block mb-1 font-semibold">After Discount</label>
          <input
            type="number"
            name="discount_price"
            value={form.discount_price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* DISCOUNT % */}
        <div>
          <label className="block mb-1 font-semibold">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Colour */}
        <div>
          <label className="block mb-1 font-semibold">Colour</label>
          <input
            type="text"
            name="colour"
            value={form.colour}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block mb-1 font-semibold">Size</label>
          <input
            type="text"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category ID</label>
          <input
            type="text"
            name="categories_id"
            value={form.categories_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category Type</label>
          <input
            type="text"
            name="category_type"
            value={form.category_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Package Items */}
        <div className="col-span-2">
          <label className="block mb-1 font-semibold">
            Package Items (comma separated)
          </label>
          <input
            type="text"
            name="package_item"
            value={form.package_item}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Deals */}
        <div>
          <label className="block mb-1 font-semibold">Deals</label>
          <input
            type="text"
            name="deals"
            value={form.deals}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Offer */}
        <div>
          <label className="block mb-1 font-semibold">Offer</label>
          <input
            type="text"
            name="offer"
            value={form.offer}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Stocks */}
        <div>
          <label className="block mb-1 font-semibold">Stocks</label>
          <input
            type="number"
            name="stocks"
            value={form.stocks}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block mb-1 font-semibold">SKU ID</label>
          <input
            type="text"
            name="sku_id"
            value={form.sku_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">SKU Name</label>
          <input
            type="text"
            name="sku_name"
            value={form.sku_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Targeted Audience */}
        <div>
          <label className="block mb-1 font-semibold">Targeted Audience</label>
          <input
            type="text"
            name="targeted_audience"
            value={form.targeted_audience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Targeted Age */}
        <div>
          <label className="block mb-1 font-semibold">Targeted Age</label>
          <input
            type="text"
            name="targeted_age"
            value={form.targeted_age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Badge */}
        <div>
          <label className="block mb-1 font-semibold">Badge</label>
          <input
            type="text"
            name="badge"
            value={form.badge}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Special Duration */}
        <div>
          <label className="block mb-1 font-semibold">Special Duration</label>
          <input
            type="text"
            name="special_duration"
            value={form.special_duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Offer Time */}
        <div>
          <label className="block mb-1 font-semibold">Offer Time</label>
          <input
            type="text"
            name="offer_time"
            value={form.offer_time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Season */}
        <div>
          <label className="block mb-1 font-semibold">Season</label>
          <input
            type="text"
            name="season"
            value={form.season}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* TXT Inputs */}
        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Description Text</label>
          <textarea
            name="description_text"
            value={form.description_text}
            onChange={handleChange}
            className="w-full p-2 border rounded h-20"
          ></textarea>
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">
            Technical Details Text
          </label>
          <textarea
            name="technical_details_text"
            value={form.technical_details_text}
            onChange={handleChange}
            className="w-full p-2 border rounded h-20"
          ></textarea>
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Additional Info</label>
          <textarea
            name="additional_info_text"
            value={form.additional_info_text}
            onChange={handleChange}
            className="w-full p-2 border rounded h-20"
          ></textarea>
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Reviews Text</label>
          <textarea
            name="reviews_text"
            value={form.reviews_text}
            onChange={handleChange}
            className="w-full p-2 border rounded h-20"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-center mt-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {mode === "add" ? "Register Product" : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
