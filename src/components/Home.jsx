// Updated Home.jsx - Enhanced mojibake fix to handle straight quote mojibake (â' -> ’)
// Added more common replacements for full UTF-8 recovery
// Also added a fallback to use non-encoded URL for testing (toggle encodeFilename = false to test)
// FIXED: Loosened tag filtering for clothing/beauty to match sample data (e.g., "Shirt" -> "cloth" or "shirt")
// ADDED: Robust product_id validation in render to prevent invalid links causing 400 errors on click
// ADDED: Better error display with retry button for fetch failures

import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../assets/Banner/MENS.jpeg";
import banner2 from "../assets/Banner/Shoes.jpeg";
import banner3 from "../assets/Banner/Headphones.jpeg";
import banner4 from "../assets/Banner/Greenshoes.jpeg";  
import banner5 from "../assets/Banner/Perfume.jpeg";

import categorie1 from "../assets/categories/clothing.jpeg";
import categorie2 from "../assets/categories/accessories.jpeg";
import categorie3 from "../assets/categories/toys.jpeg";
import categorie4 from "../assets/categories/electronics.jpeg";
import categorie5 from "../assets/categories/groceries.jpeg";
import categorie6 from "../assets/categories/beauty.jpeg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const safeParseJsonOrCsv = (value, isCsvFallback = true) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    let strValue = typeof value === 'string' ? value : String(value);
    try {
      const parsed = JSON.parse(strValue);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (parseErr) {
      console.warn("JSON parse failed for field, falling back to CSV split:", parseErr, strValue);
      if (isCsvFallback) {
        return strValue.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }
      return [];
    }
  };

  const API_BASE_URL = "http://localhost:1100";
  const PLACEHOLDER_IMAGE = "https://picsum.photos/300?product"; // Or use a local asset: import placeholder from "../assets/placeholder.jpg";

  // UPDATED: Enhanced mojibake fixes - Handle both curly and straight quote variants
  const fixMojibake = (str) => {
    return str
      // Right single quote ’ (U+2019) mojibake: â€™ or â'
      .replace(/â€™/g, "’")
      .replace(/â'/g, "’") // NEW: Straight quote variant
      // Left single quote ‘ (U+2018) : â€˜
      .replace(/â€˜/g, "‘")
      // Left double “ (U+201C) : â€œ
      .replace(/â€œ/g, "“")
      // Right double ” (U+201D) : â€
      .replace(/â€/g, "”") // Simplified for common case
      // Em dash — (U+2014) : â€”
      .replace(/â€”/g, "—");
  };

  // UPDATED: Fixed URL building - Apply mojibake fix more robustly
  const buildAbsoluteUrl = (relativePath, encodeFilename = true) => {
    if (!relativePath) return null;
    let normalized = String(relativePath)
      .replace(/\\/g, "/") // Normalize Windows backslashes
      .replace(/^uploads\//i, "") // Strip leading "uploads/" (case-insensitive) to avoid double prefix
      .replace(/^\/+/, ""); // Remove any remaining leading slashes

    // UPDATED: Apply mojibake fix
    normalized = fixMojibake(normalized);

    console.log(`Normalized filename (after mojibake fix): ${normalized}`); // Debug log for fixed name

    if (encodeFilename) {
      // Encode only the filename part for safety
      const parts = normalized.split("/");
      if (parts.length > 0) {
        parts[parts.length - 1] = encodeURIComponent(parts[parts.length - 1]);
        normalized = parts.join("/");
      }
    }

    const fullUrl = `${API_BASE_URL}/uploads/${normalized}`;
    console.log(`Built image URL: ${fullUrl}`); // Debug: Log built URLs
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

    // UPDATED: Prioritize image_path first (from your logs, it's the main field)
    const rawCandidates = [
      product.image_path, // NEW: Prioritize this
      pickFirst(product.images),
      pickFirst(product.image_paths && safeParseJsonOrCsv(product.image_paths)),
      product.mainImage?.image_path,
    ].filter(Boolean);

    if (rawCandidates.length === 0) return [PLACEHOLDER_IMAGE];

    // UPDATED: Build variants with fixed URL logic
    const variants = rawCandidates
      .map((rawPath) => buildAbsoluteUrl(rawPath))
      .filter(Boolean);

    const unique = Array.from(new Set(variants));
    console.log(`Image candidates for ${product.name}:`, unique); // NEW: Debug log
    return unique.length > 0 ? unique : [PLACEHOLDER_IMAGE];
  };

  // UPDATED: Enhanced error handling with logging
  const handleImageError = (event) => {
    const imgUrl = event.target.src;
    console.error(`Image failed to load: ${imgUrl}`); // NEW: Log failed URL for debugging

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

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:1100/api/products/all");
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Fetched products:", result);
      if (response.ok) {
        const parsedProducts = (result.products || []).map(product => ({
          ...product,
          colours: safeParseJsonOrCsv(product.colours || "[]", true),
          tags: safeParseJsonOrCsv(product.tags || "[]", false),
          images: safeParseJsonOrCsv(product.images || "[]", false),
          image_paths: safeParseJsonOrCsv(product.image_paths || "[]", false),
        }));
        // NEW: Log first product's image candidates for debug
        if (parsedProducts.length > 0) {
          console.log("Sample image candidates:", getProductImageCandidates(parsedProducts[0]));
        }
        setProducts(parsedProducts);
        setError("");
      } else {
        setError(`Server error: ${result.error || 'Unknown'}`);
      }
    } catch (err) {
      console.error("Fetch error details:", err);
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: Retry function for error state
  const retryFetch = () => {
    setLoading(true);
    setError("");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Banner settings
  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Product carousel settings (horizontal, Amazon-style)
  const productSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // Premium carousel settings (fewer items, slower)
  const premiumSettings = {
    ...productSettings,
    slidesToShow: 4,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  // NEW: History-based section products (top 5 for horizontal listing like screenshot)
  const historyProducts = products.slice(0, 5);

  // Filtered products (increased slices for better variety)
  const discountedProducts = products.filter((p) => (p.discount || 0) > 0).slice(0, 8);
  const featuredProducts = products.slice(0, 10);
  const premiumProducts = products.filter((p) => p.base_price > 500).slice(0, 8);
  const trendingProducts = products.slice(10, 18);
  const matchForYou = products.slice(18, 26);

  // Grid products (fashion/beauty) - FIXED: Loosened tag matching to handle sample data like ["Shirt"] -> "cloth" or "shirt"
  const topClothingProducts = products.filter((p) => 
    (p.category_name || "").toLowerCase().includes("clothing") || 
    (p.tags && p.tags.some(tag => 
      tag.toLowerCase().includes("cloth") || 
      tag.toLowerCase().includes("shirt") ||
      tag.toLowerCase().includes("clothing")
    ))
  ).slice(0, 4); // Increased to 4 for better grid
  const topBeautyProducts = products.filter((p) => 
    (p.category_name || "").toLowerCase().includes("beauty") || 
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes("beauty")))
  ).slice(0, 3);

  // Hardcoded banners, categories, audiences, brands (unchanged)
  const banners = [
    { img: banner1, alt: "Big Sale" },
    { img: banner2, alt: "New Arrivals" },
    { img: banner3, alt: "Summer Collection" },
    { img: banner4, alt: "Exclusive Deals" },
    { img: banner5, alt: "Trending Now" },
  ];

  const categories = [
    { name: "Clothing", img: categorie1, link: "/category/clothing" },
    { name: "Accessories", img: categorie2, link: "/category/accessories" },
    { name: "Toys", img: categorie3, link: "/category/toys" },
    { name: "Electronics", img: categorie4, link: "/category/electronics" },
    { name: "Groceries", img: categorie5, link: "/category/groceries" },
    { name: "Beauty", img: categorie6, link: "/category/beauty" },
  ];

  const audiences = [
    { name: "Men", img: "https://picsum.photos/200/200?men", link: "/men" },
    { name: "Women", img: "https://picsum.photos/200/200?women", link: "/women" },
    { name: "Kids", img: "https://picsum.photos/200/200?kids", link: "/kids" },
    { name: "Decoration", img: "https://picsum.photos/200/200?professional", link: "/professional" },
    { name: "Festible", img: "https://picsum.photos/200/200?trainer", link: "/trainer" },
  ];

  const brands = [
    { name: "Nike", img: "https://picsum.photos/100/50?nike" },
    { name: "Adidas", img: "https://picsum.photos/100/50?adidas" },
    { name: "Apple", img: "https://picsum.photos/100/50?apple" },
    { name: "Samsung", img: "https://picsum.photos/100/50?samsung" },
  ];

  // UPDATED: Unified renderAmazonStyleCard - Professional Amazon-like card matching screenshots
  // Features: Image, deal badge + text, pricing with MRP strike, title, color dots, ratings
  // FIXED: Added product_id validation to prevent invalid links
  const renderAmazonStyleCard = (product) => {
    // NEW: Validate product_id to avoid linking to invalid IDs
    if (!product.product_id || isNaN(parseInt(product.product_id))) {
      console.warn("Skipping invalid product_id in card:", product);
      return null;
    }

    const priceAfterDiscount = Number(product.total_amt_after_discount || 0);
    const mrp = Number(product.base_price || 0);
    const discount = Number(product.discount || 0);
    const colours = product.colours || [];
    const rating = product.rating || 4.5; // Placeholder; use real data
    const reviews = product.reviews || 123; // Placeholder

    const imageCandidates = getProductImageCandidates(product);
    const [primaryImage, ...fallbackImages] = imageCandidates;

    return (
      <div className="amazon-card">
        <Link to={`/product/${product.product_id}`}>
          <div className="amazon-img-wrap">
            <img
              src={primaryImage}
              data-fallbacks={JSON.stringify(fallbackImages)}
              alt={product.name}
              onError={handleImageError}
              loading="lazy" // NEW: Lazy load for performance
            />
          </div>

          <div className="deal-line">
            {discount > 0 && <span className="deal-badge">{discount}% off</span>}
            <span className="deal-text">Limited time deal</span>
          </div>

          <div className="price-line">
            <span className="deal-price">₹{priceAfterDiscount.toFixed(2)}</span>
            {mrp > priceAfterDiscount && (
              <span className="mrp">M.R.P: <s>₹{mrp.toFixed(2)}</s></span>
            )}
          </div>

          <h4 className="product-title">{product.title || product.name}</h4>

          {/* NEW: Ratings like screenshot */}
          <div className="rating-line">
            <span className="stars">★★★★☆ {rating}</span>
            <span className="reviews">({reviews} reviews)</span>
          </div>

          {colours.length > 0 && (
            <div className="colour-row">
              {colours.slice(0, 5).map((c, i) => (
                <span key={i} className="colour-dot" style={{ backgroundColor: c }} title={c}></span>
              ))}
            </div>
          )}
        </Link>
      </div>
    );
  };

  // UPDATED: For grids (fashion/beauty) - Use same card but without slider constraints
  const renderGridAmazonCard = (product) => (
    <div className="amazon-grid-card">
      {renderAmazonStyleCard(product)}
    </div>
  );

  if (loading) return <div className="loading">Loading home page...</div>;
  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={retryFetch}>Retry</button>
    </div>
  );

  return (
    <div className="home-container">
      {/* NEW: Based on your browsing history - Horizontal slider like pajama screenshot */}
      <section className="history-section">
        <div className="history-header">
          <h2 className="section-title">Based on your browsing history</h2>
          <Link to="/history" className="see-more">See more</Link>
        </div>
        <Slider {...productSettings}>
          {historyProducts.map((product) => renderAmazonStyleCard(product)).filter(Boolean)} {/* Filter out invalid cards */}
        </Slider>
      </section>

      {/* Big Banner Slider */}
      <section className="banner-section">
        <Slider {...bannerSettings}>
          {banners.map((banner, idx) => (
            <div key={idx}>
              <img src={banner.img} alt={banner.alt} className="banner-img" />
            </div>
          ))}
        </Slider>
      </section>              

      {/* Product Categories */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <Link key={idx} to={cat.link} className="category-card">
              <div className="category-image-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <p className="category-name">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Fashion Section - Grid with Amazon cards */}
      <section className="fashion-section">
        <h2 className="section-title">Today's Fashion Picks</h2>
        {topClothingProducts.length > 0 ? (
          <div className="fashion-grid">
            {topClothingProducts.map((product) => renderGridAmazonCard(product)).filter(Boolean)}
          </div>
        ) : (
          <div className="no-products">No clothing products available yet!</div>
        )}
      </section>

      {/* Super Saving Zone (Discounted Products) - Amazon-style slider */}
      <section className="saving-zone">
        <h2 className="section-title">Super Saving Zone</h2>
        <Slider {...productSettings}>
          {discountedProducts.map((product) => renderAmazonStyleCard(product)).filter(Boolean)}
        </Slider>
      </section>

      {/* Featured Products - Amazon-style slider */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <Slider {...productSettings}>
          {featuredProducts.map((product) => renderAmazonStyleCard(product)).filter(Boolean)}
        </Slider>
      </section>

      {/* Unified Premium Products - Amazon-style slider (removed duplicate) */}
      <section className="premium-section">
        <h2 className="section-title">Premium Collection</h2>
        <Slider {...premiumSettings}>
          {premiumProducts.map((product) => renderAmazonStyleCard(product)).filter(Boolean)}
        </Slider>
      </section>

      {/* Audience Section */}
      <section className="audience-section">
        <h2 className="section-title">Shop For</h2>
        <div className="audience-grid">
          {audiences.map((aud, idx) => (
            <Link key={idx} to={aud.link} className="audience-card">
              <div className="audience-image-wrapper">
                <img src={aud.img} alt={aud.name} />
              </div>
              <p className="audience-name">{aud.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="brands-section">
        <h2 className="section-title">Our Brands</h2>
        <div className="brands-grid">
          {brands.map((brand, idx) => (
            <div key={idx} className="brand-logo">
              <img src={brand.img} alt={brand.name} />
              <p className="brand-name">{brand.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products - Amazon-style slider */}
      <section className="trending-section">
        <h2 className="section-title">Trending Now</h2>
        <Slider {...productSettings}>
          {trendingProducts.map((product) => renderAmazonStyleCard(product)).filter(Boolean)}
        </Slider>
      </section>

      {/* Match For You - Amazon-style slider */}
      <section className="match-section">
        <h2 className="section-title">Recommended For You</h2>
        <Slider {...productSettings}>
          {matchForYou.map((product) => renderAmazonStyleCard(product)).filter(Boolean)}
        </Slider>
      </section>

      {/* Beauty Products - Grid with Amazon cards */}
      <section className="beauty-section">
        <h2 className="section-title">Beauty Essentials</h2>
        {topBeautyProducts.length > 0 ? (
          <div className="beauty-grid">
            {topBeautyProducts.map((product) => renderGridAmazonCard(product)).filter(Boolean)}
          </div>
        ) : (
          <div className="no-products">No beauty products available yet!</div>
        )}
      </section>
    </div>
  );
};

export default Home;