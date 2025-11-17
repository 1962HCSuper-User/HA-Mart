import React from "react";
import "./BuyWith.css";

const BuyWith = () => {
  const items = [
    {
      name: "Fire-Boltt Phoenix Smartwatch 1.39” HD Display",
      image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg",
      price: 1299,
    },
    {
      name: "boAt Wave Call 2 Smartwatch 1.83” Display",
      image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg",
      price: 1599,
    },
    {
      name: "Noise Pulse 2 Max Smartwatch 1.85” Display",
      image: "https://m.media-amazon.com/images/I/61TapeOXotL._SL1500_.jpg",
      price: 1499,
    },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bw-section">
      <h2 className="bw-heading">Buy it with</h2>

      <div className="bw-container">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="bw-card">
              <div className="bw-img-box">
                <img src={item.image} alt={item.name} />
              </div>

              <p className="bw-title">{item.name}</p>
              <p className="bw-price">₹{item.price}</p>
            </div>

            {index < items.length - 1 && (
              <span className="bw-plus">+</span>
            )}
          </React.Fragment>
        ))}

        <div className="bw-total-panel">
          <p className="bw-total">Total: ₹{total}</p>
          <button className="bw-btn">Add all to cart</button>
        </div>
      </div>
    </div>
  );
};

export default BuyWith;
