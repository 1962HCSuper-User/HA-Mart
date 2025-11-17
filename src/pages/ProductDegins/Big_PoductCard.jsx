import React from "react";
import "./Big_PoductCard.css";

const formatNum = (v) => Number(String(v).replace(/,/g, "")).toLocaleString("en-IN");

const ProductCard_BigDiv = ({ product }) => {
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <>
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </>
    );
  };

  return (
    <div className="amazon-card">
      <div className="amazon-img">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="amazon-info">
        <h3 className="amazon-title">{product.name}</h3>

        <div className="amazon-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-count">{formatNum(product.ratingCount)}</span>
        </div>

        <div className="deal-line">
          <span className="deal-badge">{product.discount}% off</span>
          <span className="deal-text">Limited time deal</span>
        </div>

        <div className="price-line">
          <span className="currency">₹</span>
          <span className="price">{formatNum(product.price)}</span>
        </div>

        <div className="mrp-line">
          M.R.P.: <span className="mrp">₹{formatNum(product.mrp)}</span>
        </div>

        <div className="delivery-main">
          Get it by <span>{product.deliveryDate}</span>
        </div>
        <div className="delivery-free">FREE Delivery by Amazon</div>
      </div>
    </div>
  );
};

export default ProductCard_BigDiv;
