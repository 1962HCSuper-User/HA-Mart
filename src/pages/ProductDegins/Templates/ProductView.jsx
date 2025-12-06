// Fixed ProductView.jsx - Add onClick handlers for "Add to Cart" and "Buy Now"
// "Add to Cart" posts to API without navigating
// "Buy Now" navigates directly to /checkout?product=${id} (bypasses cart)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // NEW: Import axios for Add to Cart API call
import "./ProductView.css";
import ProductCardLinear from "../ProductCard_Linear";
import ProductCard_BigDiv from "../Big_PoductCard";
import BuyWith from "../BuyWith";

const API_BASE_URL = "http://localhost:1100";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600?text=No+Image";

const safeParseJsonOrCsv = (value, isCsvFallback = true) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  let strValue = typeof value === "string" ? value : String(value);
  try {
    const parsed = JSON.parse(strValue);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (parseErr) {
    console.warn(
      "JSON parse failed for field, falling back to CSV split:",
      parseErr,
      strValue
    );
    if (isCsvFallback) {
      return strValue
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return [];
  }
};

const fixMojibake = (str) => {
  return str
    .replace(/â€™/g, "’")
    .replace(/â'/g, "’")
    .replace(/â€˜/g, "‘")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â—/g, "—");
};

const buildAbsoluteUrl = (relativePath, encodeFilename = true) => {
  if (!relativePath) return null;
  let normalized = String(relativePath)
    .replace(/\\/g, "/")
    .replace(/^uploads\//i, "")
    .replace(/^\/+/, "");

  normalized = fixMojibake(normalized);

  console.log(`Normalized filename (after mojibake fix): ${normalized}`);

  if (encodeFilename) {
    const parts = normalized.split("/");
    if (parts.length > 0) {
      parts[parts.length - 1] = encodeURIComponent(parts[parts.length - 1]);
      normalized = parts.join("/");
    }
  }

  const fullUrl = `${API_BASE_URL}/uploads/${normalized}`;
  console.log(`Built image URL: ${fullUrl}`);
  return fullUrl;
};

const getProductImageCandidates = (product) => {
  const pickFirst = (input) => {
    if (!input) return null;
    if (Array.isArray(input)) {
      const first = input[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object") return first.image_path || first.url;
      return null;
    }
    if (typeof input === "object") return input.image_path || input.url;
    return input;
  };

  let imagePaths = product.image_paths || [];
  if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
    imagePaths = product.image_path ? [product.image_path] : [];
  }

  const rawCandidates = [
    pickFirst(imagePaths),
    pickFirst(product.images),
    product.mainImage?.image_path,
  ].filter(Boolean);

  const buildVariants = (rawPath) => {
    if (!rawPath) return [];
    const normalized = String(rawPath).replace(/\\/g, "/").replace(/^\/+/, "");
    if (/^https?:\/\//i.test(normalized)) return [normalized];

    const variants = [
      buildAbsoluteUrl(normalized, true),
      buildAbsoluteUrl(normalized, false),
      buildAbsoluteUrl(rawPath, false),
    ].filter(Boolean);

    return Array.from(new Set(variants));
  };

  const candidateObjects = rawCandidates
    .map((rawPath) => {
      const variants = buildVariants(rawPath);
      if (!variants.length) return null;
      return {
        src: variants[0],
        fallbacks: variants.slice(1),
      };
    })
    .filter(Boolean);

  if (!candidateObjects.length) {
    return [{ src: PLACEHOLDER_IMAGE, fallbacks: [] }];
  }

  console.log(`Image candidates for ${product.name}:`, candidateObjects);
  return candidateObjects;
};

export default function ProductPage() {
  const { id } = useParams(); // Get product_id from route, e.g., /product/:id
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageCandidates, setImageCandidates] = useState([
    { src: PLACEHOLDER_IMAGE, fallbacks: [] },
  ]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleImageError = (event) => {
    const imgUrl = event.target.src;
    console.error(`Image failed to load: ${imgUrl}`);

    try {
      const fallbacks = JSON.parse(event.target.dataset.fallbacks || "[]");
      if (fallbacks.length > 0) {
        const nextSrc = fallbacks.shift();
        event.target.dataset.fallbacks = JSON.stringify(fallbacks);
        event.target.src = nextSrc;
        console.log(`Trying fallback: ${nextSrc}`);
      } else {
        event.target.onerror = null;
        event.target.src = PLACEHOLDER_IMAGE;
        console.log(`All fallbacks exhausted, using placeholder`);
      }
    } catch (e) {
      console.error("Fallback parsing error:", e);
      event.target.onerror = null;
      event.target.src = PLACEHOLDER_IMAGE;
    }
  };

  // NEW: Add to Cart handler (posts to API, shows success/error)
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add to cart");
        navigate("/login");
        return;
      }
      await axios.post(
        "http://localhost:1100/api/cart/add",
        { product_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err.response?.data?.error || "Failed to add to cart");
    }
  };

  // NEW: Buy Now handler (navigates to checkout with product ID, skips cart)
  const buyNow = () => {
    // Optionally check auth
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to buy");
      navigate("/login");
      return;
    }
    // Navigate directly to checkout with product query param
    navigate(`/checkout?product=${id}`);
  };

  // Fetch product data - UPDATED: Parse JSON fields + ensure numeric fields
  useEffect(() => {
    if (!id) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:1100/api/products/${id}`);
        const result = await response.json();

        if (response.ok) {
          const parsedProduct = {
            ...result.product,
            // 🔹 FIXED: Safe parse for tags/colours (backend already does, but double-check)
            tags: safeParseJsonOrCsv(result.product.tags || "[]", false),
            colours: safeParseJsonOrCsv(result.product.colours || "[]", true),
            image_paths: safeParseJsonOrCsv(result.product.image_paths || "[]", false),  // 🔹 NEW: Ensure array
            // 🔹 FIXED: Ensure numeric fields for toFixed safety
            base_price: parseFloat(result.product.base_price) || 0,
            discount: parseFloat(result.product.discount) || 0,
            total_amt_after_discount: parseFloat(result.product.total_amt_after_discount) || 0,
          };
          const candidates = getProductImageCandidates(parsedProduct);
          console.log("Sample image candidates:", candidates);
          setImageCandidates(candidates);
          setActiveImageIndex(0);
          setProduct(parsedProduct);
        } else {
          setError(result.error || "Failed to load product");
        }
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Static data for sections (unchanged, but can fetch dynamically later)
  const bigCardProducts = [
    {
      name: "Nervfit Orion S1 Smartwatch",
      image: "https://via.placeholder.com/300?text=Premium+Watch",
      rating: 4.4,
      ratingCount: 3350,
      discount: 48,
      price: 2249,
      mrp: 4299,
      deliveryDate: "Wednesday, 27 Nov",
    },
    {
      name: "Fire-Boltt Phoenix Smartwatch",
      image: "https://via.placeholder.com/300?text=Phoenix",
      rating: 4.1,
      ratingCount: 2100,
      discount: 52,
      price: 1999,
      mrp: 4199,
      deliveryDate: "Thursday, 28 Nov",
    },
  ];

  const linearProducts = [
    {
      name: "boAt Wave Call 2 Smartwatch 1.83” Display",
      image: "https://via.placeholder.com/250?text=boAt+Wave",
      rating: 4.2,
      ratingCount: 1200,
      badge: "Deal of the Day",
      discount: 55,
      price: 1599,
      mrp: 3499,
    },
    {
      name: "Noise Pulse 2 Max Smartwatch 1.85” Display",
      image: "https://via.placeholder.com/250?text=Noise+Pulse",
      rating: 4.3,
      ratingCount: 950,
      badge: "Bestseller",
      discount: 50,
      price: 1499,
      mrp: 2999,
    },
    {
      name: "Amazfit Bip 5 Unity Smartwatch",
      image: "https://via.placeholder.com/250?text=Amazfit+Bip",
      rating: 4.5,
      ratingCount: 1425,
      badge: "New launch",
      discount: 40,
      price: 4999,
      mrp: 8299,
    },
  ];

  if (loading) {
    return <div className="page-wrapper">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="page-wrapper">
        <div className="error-message">{error || "Product not found"}</div>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Calculate discount percentage - UPDATED: Use parsed numbers
  const discountPercent = Math.round(((product.base_price - product.total_amt_after_discount) / product.base_price) * 100);

  const activeImage =
    imageCandidates[activeImageIndex] || { src: PLACEHOLDER_IMAGE, fallbacks: [] };

  return (
    <div className="page-wrapper">
      {/* MAIN CONTAINER */}
      <div className="page-container">
        
        {/* LEFT SIDE IMAGES - UPDATED: Clickable gallery */}
        <div className="gallery">
          <div className="thumb-list">
            {imageCandidates.map((candidate, i) => (
              <button
                key={`${candidate.src}-${i}`}
                className={`thumb-item ${i === activeImageIndex ? "active" : ""}`}
                onClick={() => setActiveImageIndex(i)}
                type="button"
                aria-label={`Preview image ${i + 1}`}
              >
                <img
                  src={candidate.src}
                  data-fallbacks={JSON.stringify(candidate.fallbacks)}
                  alt={`thumb ${i + 1}`}
                  onError={handleImageError}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          {/* MAIN IMAGE - UPDATED */}
          <div className="main-image">
            <img
              src={activeImage.src}
              data-fallbacks={JSON.stringify(activeImage.fallbacks)}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        </div>
        {/* PRODUCT DETAILS - UPDATED: Use parsed colours/tags */}
        <div>
          <h1 className="product-title">{product.title || product.name}</h1>
          <div className="rating-box">
            <span className="rating-stars">★★★★☆</span>
            <span className="rating-link">3 ratings</span>
            <span className="amz-choice">Amazon's Choice</span>
          </div>
          <div className="price-section">
            <span className="price">-{discountPercent}% ₹{product.total_amt_after_discount.toFixed(2)}</span>
            <span className="mrp">₹{product.base_price.toFixed(2)}</span>
            <p>Inclusive of all taxes</p>
          </div>
          {/* Offers - Static for now */}
          <div className="offer-box">
            <h2 className="offer-title">Offers</h2>
            <div className="offer-grid">
              <div className="offer-item">
                <h3>Cashback</h3>
                <p>Upto ₹67 cashback on Amazon Pay</p>
              </div>
              <div className="offer-item">
                <h3>No Cost EMI</h3>
                <p>Starts at ₹109/month</p>
              </div>
              <div className="offer-item">
                <h3>Bank Offer</h3>
                <p>Upto ₹1500 discount</p>
              </div>
            </div>
          </div>
        </div>
        {/* BUY BOX - FIXED: Added onClick handlers */}
        <div className="buy-box">
          <p className="buy-price">₹{product.total_amt_after_discount.toFixed(2)}</p>
          <p className="buy-mrp">₹{product.base_price.toFixed(2)}</p>
          <p>FREE Delivery Tomorrow</p>
          <button className="buy-btn add-cart" onClick={addToCart}>Add to Cart</button>
          <button className="buy-btn buy-now" onClick={buyNow}>Buy Now</button>
          <div className="buy-info">
            <p><b>Ships from:</b> Amazon</p>
            <p><b>Sold by:</b> {product.seller_name || 'Seller'}</p>
            <p><b>Payment:</b> Secure transaction</p>
          </div>
        </div>
      </div>

      {/* OFFER BADGE AND PRICE SUMMARY (MOVED FROM BOTTOM) */}
      <div className="offer-badge">Limited Time Deal</div>
      <div className="price-summary">
        <span className="price">₹{product.total_amt_after_discount.toFixed(2)}</span>
        <span className="mrp">₹{product.base_price.toFixed(2)}</span>
      </div>
      <div className="discount-text">{discountPercent}% off</div>
      <div className="label">Inclusive of all taxes</div>

      {/* INTEGRATED SECTIONS */}
      <div className="full-width-section">
        <div className="section">
          <h2 className="section-title">Featured limited-time deals</h2>
          <div className="big-card-grid">
            {bigCardProducts.map((p, idx) => (
              <ProductCard_BigDiv key={idx} product={p} />
            ))}
          </div>
        </div>

        <BuyWith />

        <div className="section">
          <h2 className="section-title">Recommended {product.type}s</h2>
          <div className="linear-card-list">
            {linearProducts.map((p, idx) => (
              <ProductCardLinear key={idx} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* FULL-WIDTH SECTIONS BELOW MAIN GRID */}
      <div className="full-width-section">
        {/* FREQUENTLY BOUGHT TOGETHER - UPDATED: Use buildAbsoluteUrl */}
        <div className="section">
          <h2 className="section-title">Frequently bought together</h2>
          <div className="bundle-grid">
            <div className="bundle-item">
              <img 
                src={activeImage.src} 
                alt={product.name} 
                data-fallbacks={JSON.stringify(activeImage.fallbacks)}
                onError={handleImageError}
              />
              <p>{product.name}</p>
              <span className="bundle-price">₹{product.total_amt_after_discount.toFixed(2)}</span>
            </div>
            <div className="bundle-item plus">+</div>
            <div className="bundle-item">
              <img src="https://via.placeholder.com/150?text=Product+2" alt="Bundle 2" />
              <p>Screen Protector</p>
              <span className="bundle-price">₹299</span>
            </div>
            <div className="bundle-item plus">+</div>
            <div className="bundle-item">
              <img src="https://via.placeholder.com/150?text=Product+3" alt="Bundle 3" />
              <p>Charging Cable</p>
              <span className="bundle-price">₹199</span>
            </div>
          </div>
          <p className="bundle-total">Total: ₹{/* Calculate dynamically */} <span className="save-text">(Save ₹150)</span></p>
          <button className="bundle-btn">Add these 3 items to cart</button>
        </div>

        {/* WHAT DO CUSTOMERS BUY AFTER VIEWING THIS ITEM? - Static */}
        <div className="section">
          <h2 className="section-title">What do customers buy after viewing this item?</h2>
          <div className="product-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=After+View+${i}`} alt={`After view ${i}`} />
                <p>Related Product {i}</p>
                <span className="card-price">₹{1000 + i * 100}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT'S IN THE BOX - Static */}
        <div className="section">
          <h2 className="section-title">What's in the box?</h2>
          <ul className="box-list">
            <li>{product.name}</li>
            <li>Charging Cable</li>
            <li>User Manual</li>
            <li>Warranty Card</li>
          </ul>
        </div>

        {/* BANNER/ADVERTISEMENTS - Static */}
        <div className="banner-section">
          <img src="https://via.placeholder.com/1200x200?text=Advertisement+Banner" alt="Ad Banner" />
        </div>

        {/* PRODUCT INFORMATION - Dynamic where possible - UPDATED: Use parsed data */}
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
              <tr>
                <td>Type: {product.type}</td>
                <td>Category ID: {product.category_id || 'N/A'}</td>
              </tr>
              <tr>
                <td>Colors: {product.colours.join(', ')}</td>  {/* 🔹 UPDATED: Parsed */}
                <td>Tags: {product.tags.join(', ')}</td>  {/* 🔹 UPDATED: Parsed */}
              </tr>
              <tr>
                <td>Base Price: ₹{product.base_price.toFixed(2)}</td>
                <td>Discount: {product.discount.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRODUCT DESCRIPTION - UPDATED: Use buildAbsoluteUrl for images */}
        <div className="section">
          <h2 className="section-title">Product description</h2>
          <p className="description-text">
            {product.description || `Discover the ${product.name}. A premium ${product.type} with exceptional quality.`}
          </p>
          <div className="description-images">
            {imageCandidates.slice(1, 4).map((candidate, i) => (
              <img
                key={candidate.src + i}
                src={candidate.src}
                alt={`Desc ${i + 1}`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* ADDITIONAL INFORMATION & FEEDBACK - Static */}
        <div className="section">
          <h2 className="section-title">Additional Information</h2>
          <p>Manufacturer: {product.seller_name || 'Unknown'}, Country of Origin: India</p>
          <div className="feedback">
            <h3>Feedback</h3>
            <p>What do you feel about us? Share your thoughts!</p>
            <textarea placeholder="Write your feedback..." className="feedback-textarea"></textarea>
            <button className="feedback-btn">Submit</button>
          </div>
        </div>

        {/* CUSTOMERS WHO BOUGHT THIS ALSO BOUGHT - Static */}
        <div className="section">
          <h2 className="section-title">Customers who bought this item also bought</h2>
          <div className="product-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=Also+Bought+${i}`} alt={`Also bought ${i}`} />
                <p>Also Bought Product {i}</p>
                <span className="card-price">₹{800 + i * 200}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS RELATED TO THIS ITEM - Static */}
        <div className="section">
          <h2 className="section-title">Products related to this item</h2>
          <div className="product-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=Related+${i}`} alt={`Related ${i}`} />
                <p>Related Product {i}</p>
                <span className="card-price">₹{1200 + i * 100}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIMILAR BRANDS - Static */}
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

        {/* CUSTOMER REVIEWS - Static - UPDATED: Dynamic type */}
        <div className="section">
          <h2 className="section-title">Customer reviews</h2>
          <div className="reviews-subsection">
            <h3>Customers say</h3>
            <p>Most positive review: Great {product.type}!</p>  {/* 🔹 UPDATED */}
          </div>
          <div className="reviews-subsection">
            <h3>Review this product</h3>
            <p>Share your experience.</p>
            <button className="review-btn">Write a review</button>
          </div>
          <div className="reviews-subsection">
            <h3>Customers say</h3>
            <p>Overall satisfaction: 4.2/5</p>
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

        {/* ADDITIONAL ITEMS TO EXPLORE - Static */}
        <div className="section">
          <h2 className="section-title">Additional items to explore</h2>
          <p>See more</p>
          <div className="product-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=Explore+${i}`} alt={`Explore ${i}`} />
                <p>Explore Product {i}</p>
                <span className="card-price">₹{900 + i * 150}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MORE ITEMS TO CONSIDER - Static */}
        <div className="section">
          <h2 className="section-title">More items to consider</h2>
          <p>See more</p>
          <div className="product-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=Consider+${i}`} alt={`Consider ${i}`} />
                <p>Consider Product {i}</p>
                <span className="card-price">₹{1100 + i * 100}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEE PERSONALIZED RECOMMENDATIONS - Static */}
        <div className="section">
          <h2 className="section-title">See personalized recommendations</h2>
          <div className="product-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=Personalized+${i}`} alt={`Personalized ${i}`} />
                <p>Personalized Product {i}</p>
                <span className="card-price">₹{1300 + i * 200}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}