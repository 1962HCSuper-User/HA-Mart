import React from "react";
import ProductCard from "./ProductDegins/ProductCard_Linear";
import "./ProductGrid.css";
import ProductCard_BigDiv from "./ProductDegins/Big_PoductCard";
import BuyWith from "./ProductDegins/BuyWith";


const products = [
  {
    name: "boAt Airdopes 161 TWS Earbuds with 40H Playtime, ASAP Charge, Bluetooth v5.1",
    image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg",
    price: 999,
    mrp: 2490,
    discount: 60,
    rating: 4.2,
    ratingCount: 15982,
    badge: "Limited Offer",
    trusted: true,
  },
  {
    name: "Fire-Boltt Ninja 2 Max Smartwatch with SpO2, Heart Rate Monitoring, 20 Sports Modes",
    image: "https://m.media-amazon.com/images/I/61y2VVWcGBL._SL1500_.jpg",
    price: 1199,
    mrp: 4999,
    discount: 76,
    rating: 4.0,
    ratingCount: 8214,
    badge: "Limited Offer",
    trusted: true,
  },
  {
    name: "OnePlus Bullets Wireless Z2 Bluetooth Neckband Earphones",
    image: "https://m.media-amazon.com/images/I/61PDbUd1VaL._SL1500_.jpg",
    price: 1999,
    mrp: 2299,
    discount: 13,
    rating: 4.5,
    ratingCount: 29341,
    badge: "Limited Offer",
    trusted: true,
  },
  {
    name: "Mi 10000mAh Power Bank 3i with 18W Fast Charging, Dual Output & Input Ports",
    image: "https://m.media-amazon.com/images/I/71lVwl3q-kL._SL1500_.jpg",
    price: 899,
    mrp: 1299,
    discount: 31,
    rating: 4.3,
    ratingCount: 45872,
    badge: "Limited Offer",
    trusted: true,
  },
  {
    name: "boAt Rockerz 255 Pro+ Bluetooth Neckband with ASAP Charge, IPX7, 40H Playtime",
    image: "https://m.media-amazon.com/images/I/61WZyS8YtBL._SL1500_.jpg",
    price: "1,499",
    mrp: 3990,
    discount: 62,
    rating: 4.4,
    ratingCount: 35127,
    badge: "Limited Offer",
    trusted: true,
  },
  {
    name: "Noise ColorFit Icon 2 Smartwatch with Bluetooth Calling, AI Voice Assistant",
    image: "https://m.media-amazon.com/images/I/61x7HQ3O4ML._SL1500_.jpg",
    price: 1799,
    mrp: 5499,
    discount: 67,
    rating: 4.1,
    ratingCount: 12980,
    badge: "Limited Offer",
    trusted: true,
  },
];

const ProductGrid = () => {
  return (
    <div className="product-grid-section">
      <h2>Based on your browsing history</h2>

      <div className="scroll-container">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      <h2>Recommended for you</h2>

      <div className="scroll-container">  
        {products.map((product, index) => (
          <ProductCard_BigDiv key={index} product={product} />
        ))}
      </div>

      
      <h2>Customers who viewed this item also viewed</h2>

      <div className="scroll-container">  
        {products.map((product, index) => (
          <ProductCard_BigDiv key={index} product={product} />
        ))}
      </div>





      <BuyWith />


    </div>
  );
};



export default ProductGrid;
