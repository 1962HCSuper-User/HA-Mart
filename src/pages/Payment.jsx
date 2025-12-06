// Fixed Payment.jsx - Normalize image_path for direct product with uploads/ prefix
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    house_no: "",
    street_village: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [walletBalance, setWalletBalance] = useState(0); // Initialize as number
  const [pin, setPin] = useState(""); // NEW: PIN for wallet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // NEW: Separate success for address
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [slip, setSlip] = useState(null);
  // NEW: For direct buy product
  const [directProduct, setDirectProduct] = useState(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  // Helper to normalize image path (add uploads/ prefix if missing)
  const normalizeImagePath = (pathStr) => {
    if (!pathStr) return 'uploads/placeholder.jpg';
    let normalized = pathStr.replace(/\\/g, '/').trim();
    if (!normalized.startsWith('uploads/')) {
      normalized = 'uploads/' + normalized;
    }
    return normalized;
  };

  // Helper to get product info for toggle (from cart or direct)
  const getProductInfo = (productId) => {
    const cartItem = cart.find(c => c.product_id === productId);
    if (cartItem) {
      return {
        price: parseFloat(cartItem.total_amt_after_discount) || 0,
        name: cartItem.name || cartItem.title || 'Unknown'
      };
    }
    if (directProduct && directProduct.product_id === productId) {
      return {
        price: directProduct.price,
        name: directProduct.name || directProduct.title || 'Unknown'
      };
    }
    return { price: 0, name: 'Unknown' };
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch cart (always, but may not use for display)
        const cartResponse = await axios.get("http://localhost:1100/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(cartResponse.data.cart || []);

        // Fetch wallet - FIXED: parseFloat
        const walletResponse = await axios.get("http://localhost:1100/api/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWalletBalance(parseFloat(walletResponse.data.balance) || 0);

        // Fetch addresses
        const addressesResponse = await axios.get("http://localhost:1100/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(addressesResponse.data.addresses || []);

        // Handle direct product or cart selection
        const productId = new URLSearchParams(location.search).get("product");
        let initialSelected = [];
        if (productId) {
          setIsDirectBuy(true);
          const targetId = parseInt(productId);
          // Always fetch the product for direct buy to ensure full details
          try {
            const productResponse = await axios.get(`http://localhost:1100/api/products/${productId}`);
            let prod = productResponse.data.product;
            const images = productResponse.data.images || []; // Handle old backend with images array
            if (images.length > 0 && !prod.image_path) {
              // If no image_path in product, use first image
              prod.image_path = images[0].image_path || images[0].path;
            }
            // FIXED: Use first image from image_paths if image_path not set
            if (!prod.image_path && prod.image_paths && prod.image_paths.length > 0) {
              prod.image_path = prod.image_paths[0];
            }
            // FIXED: Normalize image_path for direct product
            const normalizedImagePath = normalizeImagePath(prod.image_path);
            const directItem = {
              ...prod,
              image_path: normalizedImagePath, // Ensure image_path is set and normalized
              product_id: targetId,
              quantity: 1,
              price: parseFloat(prod.total_amt_after_discount) || 0
            };
            setDirectProduct(directItem);
            initialSelected = [directItem];
          } catch (fetchErr) {
            console.error("Failed to fetch direct product:", fetchErr);
            setError("Failed to load product details");
            // Fallback: Use cart item if available
            const cartItem = cartResponse.data.cart.find(p => parseInt(p.product_id) === targetId);
            if (cartItem) {
              initialSelected = [{
                ...cartItem,
                quantity: 1,
                price: parseFloat(cartItem.total_amt_after_discount) || 0
              }];
            }
          }
        } else {
          setIsDirectBuy(false);
          // No direct, select all cart items
          initialSelected = cartResponse.data.cart.map(p => ({
            ...p,
            quantity: 1,
            price: parseFloat(p.total_amt_after_discount) || 0
          }));
        }
        setSelectedProducts(initialSelected);

        // Auto-select default address
        const defaultAddress = addressesResponse.data.addresses?.find(a => a.is_default);
        if (defaultAddress) setSelectedAddressId(defaultAddress.address_id);

        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, navigate]);

  // Display products: ONLY direct if isDirectBuy, else cart
  const displayProducts = isDirectBuy 
    ? (directProduct ? [directProduct] : []) 
    : cart;

  // Toggle product
  const toggleProduct = (productId) => {
    const info = getProductInfo(productId);
    setSelectedProducts(prev =>
      prev.find(p => p.product_id === productId)
        ? prev.filter(p => p.product_id !== productId)
        : [...prev, {
            product_id: productId,
            quantity: 1,
            price: info.price,
            name: info.name
          }]
    );
  };

  // Update quantity
  const updateQuantity = (productId, qty) => {
    const newQty = Math.max(1, parseInt(qty) || 1);
    setSelectedProducts(prev =>
      prev.map(p => p.product_id === productId ? { ...p, quantity: newQty } : p)
    );
  };

  // Save new address
  const saveNewAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:1100/api/addresses/add", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // FIXED: Add new address to list
      const newAddr = { ...newAddress, address_id: response.data.address_id };
      setAddresses([newAddr, ...addresses]);
      setSelectedAddressId(response.data.address_id);
      setNewAddress({ house_no: "", street_village: "", city: "", state: "", pincode: "", is_default: false });
      setShowNewAddressForm(false);
      setSuccessMessage("Address saved!"); // FIXED: Use successMessage
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save address");
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:1100/api/addresses/${addressId}/set-default`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.map(a => ({ ...a, is_default: a.address_id === addressId })));
      setSelectedAddressId(addressId);
    } catch (err) {
      setError("Failed to set default");
    }
  };

  // Get full address string for selected
  const getSelectedAddress = () => {
    if (selectedAddressId) {
      const addr = addresses.find(a => a.address_id === selectedAddressId);
      if (addr) return `${addr.house_no}, ${addr.street_village}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
    }
    return "";
  };

  // Calculate totals
  const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  // Process payment
  const processPayment = async () => {
    if (selectedProducts.length === 0) {
      setError("Select at least one product");
      return;
    }
    if (!selectedAddressId && !showNewAddressForm) {
      setError("Select or add an address");
      return;
    }
    const fullAddress = showNewAddressForm ? 
      `${newAddress.house_no}, ${newAddress.street_village}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}` : 
      getSelectedAddress();
    if (!fullAddress) {
      setError("Enter a valid address");
      return;
    }
    if (paymentMethod === 'wallet') {
      if (!pin || pin.length < 7) {
        setError("Enter a valid 8-digit PIN for wallet");
        return;
      }
      if (walletBalance < total) {
        setError(`Insufficient wallet balance. Available: ₹${parseFloat(walletBalance).toFixed(2)}, Required: ₹${total.toFixed(2)}`); // FIXED: parseFloat
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        selected_products: selectedProducts.map(p => ({ 
          product_id: p.product_id, 
          quantity: p.quantity, 
          price: p.price 
        })),
        address: fullAddress,
        payment_method: paymentMethod,
      };
      // NEW: Add PIN if wallet
      if (paymentMethod === 'wallet') {
        requestBody.pin = pin;
      }

      const response = await axios.post("http://localhost:1100/api/checkout/process", requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactionId(response.data.transaction_id);
      setSlip(response.data.slip);
      setSuccess(true);

      if (response.data.success) {
        // FIXED: If not direct buy, remove selected from cart; for direct, do nothing
        if (!isDirectBuy) {
          for (const p of selectedProducts) {
            try {
              await axios.delete("http://localhost:1100/api/cart/remove", {
                headers: { Authorization: `Bearer ${token}` },
                data: { product_id: p.product_id },
              });
            } catch (removeErr) {
              console.error("Failed to remove from cart:", removeErr);
              // Continue, non-critical
            }
          }
          // Update local cart state (remove selected)
          setCart(prev => prev.filter(item => !selectedProducts.some(s => s.product_id === item.product_id)));
        }
        setSelectedProducts([]);
        setDirectProduct(null); // Clear direct
        setIsDirectBuy(false);
        setPin(""); // Clear PIN
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Payment processing failed";
      setError(errMsg);
      if (err.response?.data?.slip) {
        setSlip(err.response.data.slip);
        setTransactionId(err.response.data.transaction_id);
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="payment-loading">Loading checkout...</div>;

  return (
    <div className="payment-page">
      {!success ? (
        <>
          <h1>Checkout</h1>
          {error && <div className="payment-error">{error}</div>}
          {successMessage && <div className="payment-success">{successMessage}</div>} {/* NEW: Success display */}

          {/* Selected Products Summary */}
          <div className="products-section">
            <h2>Review Your Items ({selectedProducts.length} selected)</h2>
            {displayProducts.length === 0 ? (
              <p>No items available. <button onClick={() => navigate(isDirectBuy ? `/product/${new URLSearchParams(location.search).get("product")}` : "/cart")}>Back</button></p>
            ) : (
              displayProducts.map((item) => {
                const itemId = parseInt(item.product_id);
                const isSelected = selectedProducts.some(p => p.product_id === itemId);
                // FIXED: Ensure image src uses normalized path and fallback
                const imageSrc = `http://localhost:1100/${normalizeImagePath(item.image_path)}`;
                return (
                  <div key={itemId} className={`product-row ${isSelected ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProduct(itemId)}
                    />
                    <img 
                      src={imageSrc}
                      alt={item.name || item.title} 
                      width="50" 
                      onError={(e) => { 
                        console.error(`Image load failed for ${itemId}: ${imageSrc}`);
                        e.target.src = "https://via.placeholder.com/50?text=No+Image"; 
                      }}
                    />
                    <div className="product-info">
                      <span className="product-name">{item.title || item.name}</span>
                      <span className="product-price">₹{parseFloat(item.total_amt_after_discount || item.price || 0).toFixed(2)}</span>
                    </div>
                    {isSelected && (
                      <input
                        type="number"
                        min="1"
                        value={selectedProducts.find(p => p.product_id === itemId)?.quantity || 1}
                        onChange={(e) => updateQuantity(itemId, e.target.value)}
                        className="quantity-input"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Order Summary */}
          <div className="summary-section">
            <h2>Price Details</h2>
            <div className="summary-row">
              <span>Price ({selectedProducts.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="address-section">
            <h2>Delivery Address</h2>
            <div className="addresses-list">
              {addresses.map((addr) => (
                <div key={addr.address_id} className={`address-item ${selectedAddressId === addr.address_id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.address_id}
                    onChange={() => setSelectedAddressId(addr.address_id)}
                  />
                  <div>
                    <p>{addr.house_no}, {addr.street_village}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    {addr.is_default && <span className="default-tag">Default</span>}
                  </div>
                  {!addr.is_default && (
                    <button onClick={() => setDefaultAddress(addr.address_id)}>Set Default</button>
                  )}
                </div>
              ))}
              {addresses.length === 0 && <p>No addresses saved. Add one below.</p>}
            </div>
            <button onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
              {showNewAddressForm ? "Cancel" : "+ Add New Address"}
            </button>
            {showNewAddressForm && (
              <div className="new-address-form">
                <input
                  placeholder="House No"
                  value={newAddress.house_no}
                  onChange={(e) => setNewAddress({ ...newAddress, house_no: e.target.value })}
                  required
                />
                <input
                  placeholder="Street/Village"
                  value={newAddress.street_village}
                  onChange={(e) => setNewAddress({ ...newAddress, street_village: e.target.value })}
                  required
                />
                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
                <input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
                <input
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  required
                />
                <label>
                  <input
                    type="checkbox"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  />
                  Set as default
                </label>
                <button onClick={saveNewAddress}>Save Address</button>
              </div>
            )}
            <p className="selected-address">
              Selected: {getSelectedAddress() || "None - Add or select an address"}
            </p>
          </div>

          {/* Payment Method */}
          <div className="payment-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Wallet: ₹{parseFloat(walletBalance).toFixed(2)}</span> {/* FIXED: parseFloat */}
                {paymentMethod === "wallet" && total > walletBalance && (
                  <span className="insufficient">Insufficient</span>
                )}
                {paymentMethod === "wallet" && (
                  <input
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pin-input"
                    maxLength="7"
                  />
                )}
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit/Debit Card</span>
              </label>
            </div>
          </div>

          <button 
            onClick={processPayment} 
            disabled={loading || selectedProducts.length === 0 || (!selectedAddressId && !showNewAddressForm) || (paymentMethod === 'wallet' && (!pin || pin.length !== 7))} 
            className="proceed-btn"
          >
            {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
          </button>
        </>
      ) : (
        <div className="success-section">
          <h1>{slip?.message?.includes("successful") ? "Order Placed Successfully!" : "Transaction Update"}</h1>
          <p>Order ID: {transactionId}</p>
          <div className="slip-details">
            <h3>Receipt</h3>
            <pre>{JSON.stringify(slip, null, 2)}</pre>
            {slip?.message?.includes("failed") && <p>Failed but logged. Retry or contact support.</p>}
          </div>
          <button onClick={() => navigate("/wallet")}>Manage Wallet</button>
          <button onClick={() => navigate("/orders")}>View Orders</button>
          <button onClick={() => navigate("/")}>Shop More</button>
        </div>
      )}
    </div>
  );
};

export default Payment;