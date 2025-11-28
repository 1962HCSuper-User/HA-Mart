import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import SectionCard from "./SectionCard";
import "./Cart.css"; // Make sure this file exists for description trimming

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState({});

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your cart");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:1100/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || []);
      } else {
        setError("Failed to fetch cart");
      }
    } catch (err) {
      console.error(err);
      setError("Network error fetching cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ---------------- PRICE CALCULATIONS ----------------
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = Number(item.total_amt_after_discount ?? item.base_price ?? 0);
      return sum + price;
    }, 0);
  };

  const calculateTax = (subtotal) => Number((subtotal * 0.18).toFixed(2));

  const calculateTotal = (subtotal) => Number((subtotal + calculateTax(subtotal)).toFixed(2));

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal);

  const stats = [
    { label: "Items in cart", value: `${cart.length} items` },
    { label: "Subtotal", value: `₹${subtotal.toLocaleString()}`, tag: "Before tax" },
    { label: "Total (incl. 18% GST)", value: `₹${total.toLocaleString()}` },
  ];

  // ---------------- REMOVE ITEM ----------------
  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    setRemoving((prev) => ({ ...prev, [productId]: true }));

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:1100/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (res.ok) {
        setCart((prev) => prev.filter((item) => item.product_id !== productId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      alert("Network error removing item");
    } finally {
      setRemoving((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="cart-error">
        <h2>Cart</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/shop")}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <SectionCard
            label="Cart Summary"
            title="Order Summary"
            description="Review your items before proceeding to checkout."
            stats={stats}
            actions={[
              { label: "Proceed to Checkout", onClick: () => navigate("/checkout") },
              { label: "Continue shopping", variant: "secondary", onClick: () => navigate("/shop") },
            ]}
          >
            {/* Summary */}
            <div className="tax-breakdown">
              <div className="summary-row">
                <span>Subtotal ({cart.length} items):</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>GST (18%):</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <hr />

              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* CART ITEMS */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <img
                    src={`http://localhost:1100/${item.image_path}`}
                    alt={item.title}
                    className="cart-item-image"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />

                  <div className="cart-item-details">
                    <h3>{item.title}</h3>

                    {/* One-line description */}
<p className="cart-item-description">
  {item.description?.substring(0, 60)}...
</p>

                    {/* Price */}
                    <p className="cart-item-price">
                      {item.discount > 0 ? (
                        <>
                          <span className="original-price">₹{Number(item.base_price).toLocaleString()}</span>
                          <span className="discounted-price">₹{Number(item.total_amt_after_discount).toLocaleString()}</span>
                        </>
                      ) : (
                        <span>₹{Number(item.base_price).toLocaleString()}</span>
                      )}
                    </p>

                    {item.colours?.length > 0 && (
                      <div className="cart-item-colors">
                        <span>Colors: {item.colours.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(item.product_id)}
                    disabled={removing[item.product_id]}
                    className="remove-button"
                  >
                    {removing[item.product_id] ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default Cart;
