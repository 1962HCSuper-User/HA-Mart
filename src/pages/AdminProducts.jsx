import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:1200/api/product/list");
    setProducts(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin – Products</h1>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Images</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.title}</td>
              <td>₹{p.price}</td>
              <td>{p.category}</td>
              <td>
                <img
                  src={`http://localhost:5000/${p.main_image || "uploads/no.jpg"}`}
                  width="70"
                  style={{ borderRadius: "5px" }}
                />
              </td>
              <td>
                <button>Edit</button>
                <button style={{ marginLeft: "8px", color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
