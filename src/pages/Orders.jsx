// Orders.jsx - Orders History Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css"; // Styles

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Progress stages mapping
  const statusStages = {
    pending: { label: "Pending", color: "orange", progress: 25 },
    success: { label: "Confirmed", color: "blue", progress: 50 },
    shipped: { label: "Shipped", color: "green", progress: 75 },
    delivered: { label: "Delivered", color: "green", progress: 100 },
    cancelled: { label: "Cancelled", color: "red", progress: 0 },
    failed: { label: "Failed", color: "red", progress: 0 },
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:1100/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data.orders || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:1100/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.transaction_id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel");
    }
  };

  const [expandedOrder, setExpandedOrder] = useState(null);

  if (loading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>
            No orders yet.{" "}
            <button onClick={() => navigate("/")}>Start Shopping</button>
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const stage = statusStages[order.status] || statusStages.pending;
            const date = new Date(order.created_at).toLocaleDateString();

            return (
              <div key={order.transaction_id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.transaction_id}</h3>
                  <span className="order-date">{date}</span>
                  <span className={`status-badge ${order.status}`}>
                    {stage.label}
                  </span>

                  {/* ---------- TIMELINE ADDED HERE ---------- */}
                  <div className="progress-timeline">
                    <div className="timeline-line">
                      <div
                        className="timeline-progress"
                        style={{ width: `${stage.progress}%` }}
                      ></div>
                    </div>

                    <div
                      className={`timeline-step ${
                        stage.progress >= 25 ? "completed" : ""
                      }`}
                    >
                      Order Placed
                    </div>
                    <div
                      className={`timeline-step ${
                        stage.progress >= 50 ? "completed" : ""
                      }`}
                    >
                      Packing
                    </div>
                    <div
                      className={`timeline-step ${
                        stage.progress >= 75 ? "completed" : ""
                      }`}
                    >
                      In Your Town
                    </div>
                    <div
                      className={`timeline-step ${
                        stage.progress === 100 ? "completed" : ""
                      }`}
                    >
                      Delivered
                    </div>
                  </div>
                  {/* ---------- END TIMELINE ---------- */}
                </div>

                <div className="order-details-toggle">
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.transaction_id
                          ? null
                          : order.transaction_id
                      )
                    }
                  >
                    {expandedOrder === order.transaction_id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>

                {expandedOrder === order.transaction_id && (
                  <div className="order-expanded">
                    <div className="products-list">
                      <h4>Items:</h4>
                      {order.products.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <span>{item.name || `Product ${item.product_id}`}</span>
                          <span>Qty: {item.quantity || 1}</span>
                          <span>₹{(item.price || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary">
                      <p>Total: ₹{order.total_amount.toFixed(2)}</p>
                      <p>Payment: {order.payment_method.toUpperCase()}</p>
                      <p>Address: {order.address}</p>
                      {order.slip && (
                        <details>
                          <summary>Receipt Slip</summary>
                          <pre>{JSON.stringify(order.slip, null, 2)}</pre>
                        </details>
                      )}
                    </div>

                    <div className="order-actions">
                      {["pending", "success"].includes(order.status) && (
                        <button
                          onClick={() => cancelOrder(order.transaction_id)}
                          className="cancel-btn"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <button
                          onClick={() =>
                            navigate(`/review/${order.transaction_id}`)
                          }
                          className="review-btn"
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
