// ProductTemplate.jsx - Dynamic product page template
// Fetches data based on product_id from URL params
// Renders Amazon-style product view with dynamic data from API
// Handles multiple images from product_images table (main + thumbs)
// Assumes React Router for useParams, and fetch from /api/products/:id

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductView.css"; // Reuse the existing CSS

export default function ProductTemplate() {
  const { product_id } = useParams(); // Get product_id from URL
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]); // Array of {image_path, is_main, sort_order}
  const [details, setDetails] = useState([]); // Array of variants/sizes/colors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [product_id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:1100/api/products/${product_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data.product);
      setImages(data.images || []); // Sort by sort_order, main first
      setDetails(data.details || []);
      setError("");
    } catch (err) {
      console.error("Fetch product error:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  // Sort images: main first, then thumbs by sort_order
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_main) return -1;
    if (b.is_main) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
  const mainImage = sortedImages.find(img => img.is_main) || sortedImages[0];
  const thumbImages = sortedImages.filter(img => !img.is_main).slice(0, 6); // Up to 6 thumbs

  // Calculate discount price
  const basePrice = parseFloat(product.base_price || 0);
  const discount = parseFloat(product.discount || 0);
  const priceAfterDiscount = basePrice * (1 - discount / 100);
  const rating = product.rating || 4.0; // Placeholder; fetch from reviews if needed
  const reviewsCount = product.reviews || 3;

  // Frequently bought together (mock; fetch from API in real)
  const bundleItems = [
    { name: product.name, price: priceAfterDiscount, img: mainImage?.image_path },
    { name: "Screen Protector", price: 299, img: "https://via.placeholder.com/150?text=Protector" },
    { name: "Charging Cable", price: 199, img: "https://via.placeholder.com/150?text=Cable" },
  ];

  // Other sections (mock; replace with API fetches if needed)
  const relatedProducts = [
    { id: 1, name: "Related 1", price: 1249, img: "https://via.placeholder.com/200?text=Related+1" },
    { id: 2, name: "Related 2", price: 1349, img: "https://via.placeholder.com/200?text=Related+2" },
    { id: 3, name: "Related 3", price: 1449, img: "https://via.placeholder.com/200?text=Related+3" },
  ];

  const whatsInBox = ["Smartwatch", "Charging Cable", "User Manual", "Warranty Card"];

  const technicalDetails = [
    { key: "Brand", value: product.seller_id ? "Nervfit" : "Dynamic Brand" }, // Fetch seller name if needed
    { key: "ASIN", value: `B0ABC${product_id}` },
    { key: "Display", value: product.description?.includes("AMOLED") ? "1.43\" AMOLED" : "Dynamic Display" },
    { key: "Weight", value: "45g" },
    { key: "Battery", value: "300mAh" },
    { key: "Dimensions", value: "45x45x12mm" },
  ];

  const productDetailsTable = [
    { tech: "Brand: Nervfit", prod: "ASIN: B0ABC123" },
    { tech: "Display: 1.43\" AMOLED", prod: "Weight: 45g" },
    { tech: "Battery: 300mAh", prod: "Dimensions: 45x45x12mm" },
  ];

  return (
    <div className="page-wrapper">
      {/* MAIN CONTAINER */}
      <div className="page-container">
        {/* LEFT SIDE IMAGES */}
        <div>
          <div className="thumb-list">
            {thumbImages.map((img, i) => (
              <div key={i} className="thumb-item">
                <img
                  src={`http://localhost:1100/${img.image_path}`}
                  alt={img.alt_text || "thumb"}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/200?text=Thumb")}
                />
              </div>
            ))}
          </div>
          {/* MAIN IMAGE */}
          <div className="main-image">
            <img
              src={`http://localhost:1100/${mainImage?.image_path || product.image_path}`}
              alt={product.name}
              onError={(e) => (e.target.src = "https://via.placeholder.com/600?text=Main")}
            />
          </div>
        </div>
        {/* PRODUCT DETAILS */}
        <div>
          <h1 className="product-title">{product.title || product.name}</h1>
          <div className="rating-box">
            <span className="rating-stars">★★★★☆</span>
            <span className="rating-link">{reviewsCount} ratings</span>
            <span className="amz-choice">Amazon's Choice</span>
          </div>
          <div className="price-section">
            <span className="price">-{discount.toFixed(0)}% ₹{priceAfterDiscount.toFixed(0)}</span>
            <span className="mrp">₹{basePrice.toFixed(0)}</span>
            <p>Inclusive of all taxes</p>
          </div>
          {/* Offers - Dynamic based on product */}
          <div className="offer-box">
            <h2 className="offer-title">Offers</h2>
            <div className="offer-grid">
              <div className="offer-item">
                <h3>Cashback</h3>
                <p>Upto ₹67 cashback on Amazon Pay</p>
              </div>
              <div className="offer-item">
                <h3>No Cost EMI</h3>
                <p>Starts at ₹{Math.round(priceAfterDiscount / 24)}/month</p>
              </div>
              <div className="offer-item">
                <h3>Bank Offer</h3>
                <p>Upto ₹1500 discount</p>
              </div>
            </div>
          </div>
        </div>
        {/* BUY BOX */}
        <div className="buy-box">
          <p className="buy-price">₹{priceAfterDiscount.toFixed(2)}</p>
          <p className="buy-mrp">₹{basePrice.toFixed(2)}</p>
          <p>FREE Delivery Tomorrow</p>
          <button className="buy-btn add-cart">Add to Cart</button>
          <button className="buy-btn buy-now">Buy Now</button>
          <div className="buy-info">
            <p><b>Ships from:</b> Amazon</p>
            <p><b>Sold by:</b> {product.seller_id ? "Dynamic Seller" : "Bluemorph Brands"}</p>
            <p><b>Payment:</b> Secure transaction</p>
          </div>
        </div>
      </div>

      {/* OFFER BADGE AND PRICE SUMMARY */}
      <div className="offer-badge">Limited Time Deal</div>
      <div className="price-summary">
        <span className="price">₹{priceAfterDiscount.toFixed(0)}</span>
        <span className="mrp">₹{basePrice.toFixed(0)}</span>
      </div>
      <div className="discount-text">{discount.toFixed(0)}% off</div>
      <div className="label">Inclusive of all taxes</div>

      {/* FULL-WIDTH SECTIONS */}
      <div className="full-width-section">
        {/* FREQUENTLY BOUGHT TOGETHER */}
        <div className="section">
          <h2 className="section-title">Frequently bought together</h2>
          <div className="bundle-grid">
            {bundleItems.map((item, i) => (
              <React.Fragment key={i}>
                <div className="bundle-item">
                  <img src={`http://localhost:1100/${item.img}`} alt={item.name} />
                  <p>{item.name}</p>
                  <span className="bundle-price">₹{item.price}</span>
                </div>
                {i < bundleItems.length - 1 && <div className="bundle-item plus">+</div>}
              </React.Fragment>
            ))}
          </div>
          <p className="bundle-total">
            Total: ₹{bundleItems.reduce((sum, item) => sum + item.price, 0)}{" "}
            <span className="save-text">(Save ₹150)</span>
          </p>
          <button className="bundle-btn">Add these 3 items to cart</button>
        </div>

        {/* WHAT DO CUSTOMERS BUY AFTER VIEWING THIS ITEM? */}
        <div className="section">
          <h2 className="section-title">What do customers buy after viewing this item?</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
                <span className="card-price">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT'S IN THE BOX */}
        <div className="section">
          <h2 className="section-title">What's in the box?</h2>
          <ul className="box-list">
            {whatsInBox.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* BANNER/ADVERTISEMENTS */}
        <div className="banner-section">
          <img src="https://via.placeholder.com/1200x200?text=Advertisement+Banner" alt="Ad Banner" />
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="section">
          <h2 className="section-title">Product information</h2>
          <table className="info-table">
            <thead>
              <tr>
                <th>Technical Details</th>
                <th>Product Details</th>
              </tr>
            </thead>
            <tbody>
              {productDetailsTable.map((row, i) => (
                <tr key={i}>
                  <td>{row.tech}</td>
                  <td>{row.prod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PRODUCT DESCRIPTION */}
        <div className="section">
          <h2 className="section-title">Product description</h2>
          <p className="description-text">{product.description}</p>
          <div className="description-images">
            {sortedImages.slice(1, 4).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:1100/${img.image_path}`}
                alt={`Desc ${i + 1}`}
                onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Desc")}
              />
            ))}
          </div>
        </div>

        {/* ADDITIONAL INFORMATION & FEEDBACK */}
        <div className="section">
          <h2 className="section-title">Additional Information</h2>
          <p>Manufacturer: Nervfit Tech, Country of Origin: India</p>
          <div className="feedback">
            <h3>Feedback</h3>
            <p>What do you feel about us? Share your thoughts!</p>
            <textarea placeholder="Write your feedback..." className="feedback-textarea"></textarea>
            <button className="feedback-btn">Submit</button>
          </div>
        </div>

        {/* CUSTOMERS WHO BOUGHT THIS ALSO BOUGHT */}
        <div className="section">
          <h2 className="section-title">Customers who bought this item also bought</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
                <span className="card-price">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS RELATED TO THIS ITEM */}
        <div className="section">
          <h2 className="section-title">Products related to this item</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
                <span className="card-price">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIMILAR BRANDS */}
        <div className="section">
          <h2 className="section-title">Similar Brands</h2>
          <div className="brand-grid">
            {["Brand A", "Brand B", "Brand C", "Brand D"].map((brand, i) => (
              <div key={i} className="brand-item">
                <img src={`https://via.placeholder.com/100?text=${brand}`} alt={brand} />
                <p>{brand}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <div className="section">
          <h2 className="section-title">Customer reviews</h2>
          <div className="reviews-subsection">
            <h3>Customers say</h3>
            <p>Most positive review: Great watch!</p>
          </div>
          <div className="reviews-subsection">
            <h3>Review this product</h3>
            <p>Share your experience.</p>
            <button className="review-btn">Write a review</button>
          </div>
          <div className="reviews-subsection">
            <h3>Customers say</h3>
            <p>Overall satisfaction: {rating}/5</p>
          </div>
          <div className="reviews-subsection">
            <h3>Reviews with images</h3>
            <div className="image-reviews">
              {[1, 2].map((i) => (
                <img key={i} src={`https://via.placeholder.com/100?text=Review+Img+${i}`} alt={`Review img ${i}`} />
              ))}
            </div>
          </div>
          <div className="reviews-subsection">
            <h3>Top reviews from India</h3>
            <div className="top-review">
              <p>"Excellent product!" - User1 ★★★★★</p>
              <p>"Good value for money." - User2 ★★★★☆</p>
            </div>
          </div>
        </div>

        {/* ADDITIONAL ITEMS TO EXPLORE */}
        <div className="section">
          <h2 className="section-title">Additional items to explore</h2>
          <p>See more</p>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
                <span className="card-price">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MORE ITEMS TO CONSIDER */}
        <div className="section">
          <h2 className="section-title">More items to consider</h2>
          <p>See more</p>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
                <span className="card-price">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEE PERSONALIZED RECOMMENDATIONS */}
        <div className="section">
          <h2 className="section-title">See personalized recommendations</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} />
                <p>{p.name}</p>
                <span className="card-price">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}