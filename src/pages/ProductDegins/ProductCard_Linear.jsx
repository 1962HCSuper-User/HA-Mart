import React from "react";
import "./ProductCard_Linear.css";

// Convert value → number → format with commas
const formatNumber = (value) => {
  const num = Number(String(value).replace(/,/g, ""));
  return num.toLocaleString("en-IN");
};

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <>
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </>
    );
  };

  const price = formatNumber(product.price);
  const mrp = formatNumber(product.mrp);
  const ratingCount = formatNumber(product.ratingCount);

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => (e.target.src = "https://via.placeholder.com/250")}
        />
      </div>

      <div className="product-info">
       <herf> <h3 className="product-title">{product.name}</h3> </herf>

        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-count">{ratingCount}</span>
        </div>

        {product.badge && (
          <div className="deal-line">
            <span className="deal-badge">{product.badge}</span>
          </div>
        )}

        <div className="product-price">
          <span className="discount">-{product.discount}%</span>

          <span className="price-display">
            <span className="currency">₹</span>
            <span className="main-price">{price}</span>
          </span>
        </div>

        <div className="mrp-line">
          M.R.P.: <span className="mrp">₹{mrp}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
