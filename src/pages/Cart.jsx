// Cart.jsx - Full Cart Page Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assume axios for API calls; install if needed
import "./Cart.css"; // Assume Cart.css for styling

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Base64 SVG placeholder (no external dependency)
  const PLACEHOLDER_SVG = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";

  // Fetch cart on mount (requires auth token in localStorage or context)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token"); // Assume token stored after login
        if (!token) {
          setError("Please log in to view cart");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:1100/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCart(response.data.cart || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError("Failed to load cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:1100/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id: productId },
      });

      setCart(cart.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Remove error:", err);
      alert("Failed to remove item");
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.total_amt_after_discount || 0), 0);
  const tax = subtotal * 0.18; // Assume 18% GST
  const total = subtotal + tax;

  if (loading) return <div className="cart-loading">Loading cart...</div>;
  if (error) return <div className="cart-error">{error} <button onClick={() => navigate("/login")}>Login</button></div>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img
                  src={`http://localhost:1100/${item.image_path || 'uploads/placeholder.jpg'}`}
                  alt={item.name || item.title}
                  className="cart-item-image"
                  onLoad={() => console.log(`Image loaded: ${item.image_path}`)} // Debug: Confirm success
                  onError={(e) => {
                    console.error(`Image failed: ${item.image_path}`); // Debug: Log failures
                    e.target.src = PLACEHOLDER_SVG; // FIXED: Local base64 fallback (no DNS issue)
                  }}
                />
                <div className="cart-item-details">
                  <h3>{item.title || item.name}</h3>
                  <p className="description">{item.description?.substring(0, 100)}...</p> {/* Truncate desc */}
                  <p className="price">
                    {item.discount > 0 && (
                      <span className="original-price">₹{parseFloat(item.base_price || 0).toFixed(2)}</span>
                    )}
                    ₹{parseFloat(item.total_amt_after_discount || 0).toFixed(2)}
                  </p>
                  {item.colours && item.colours.length > 0 && (
                    <div className="colors">Colors: {item.colours.join(", ")}</div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="tags">Tags: {item.tags.join(", ")}</div>
                  )}
                </div>
                <button onClick={() => removeFromCart(item.product_id)} className="remove-btn">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items):</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;