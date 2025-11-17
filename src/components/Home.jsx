// Updated Home.jsx - Unified Amazon-style cards for professional look
// Removed duplicates, unprofessional divs; All sections now use renderAmazonStyleCard for consistency
// Added "Based on your browsing history" section matching screenshot

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:1100/api/products/all");
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Fetched products:", result);
      if (response.ok) {
        const parsedProducts = (result.products || []).map(product => ({
          ...product,
          colours: safeParseJsonOrCsv(product.colours || "[]", true),
          tags: safeParseJsonOrCsv(product.tags || "[]", false)
        }));
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
  };

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

  // Grid products (fashion/beauty)
  const topClothingProducts = products.filter((p) => 
    (p.category_name || "").toLowerCase().includes("clothing") || 
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes("clothing")))
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
  const renderAmazonStyleCard = (product) => {
    const priceAfterDiscount = Number(product.total_amt_after_discount || 0);
    const mrp = Number(product.base_price || 0);
    const discount = Number(product.discount || 0);
    const colours = product.colours || [];
    const rating = product.rating || 4.5; // Placeholder; use real data
    const reviews = product.reviews || 123; // Placeholder

    return (
      <div className="amazon-card">
        <Link to={`/product/${product.product_id}`}>
          <div className="amazon-img-wrap">
            <img
              src={`http://localhost:1100/${product.image_path}`}
              alt={product.name}
              onError={(e) => (e.target.src = "https://picsum.photos/300?product")}
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      {/* NEW: Based on your browsing history - Horizontal slider like pajama screenshot */}
      <section className="history-section">
        <div className="history-header">
          <h2 className="section-title">Based on your browsing history</h2>
          <Link to="/history" className="see-more">See more</Link>
        </div>
        <Slider {...productSettings}>
          {historyProducts.map((product) => renderAmazonStyleCard(product))}
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
            {topClothingProducts.map((product) => renderGridAmazonCard(product))}
          </div>
        ) : (
          <div className="no-products">No clothing products available yet!</div>
        )}
      </section>

      {/* Super Saving Zone (Discounted Products) - Amazon-style slider */}
      <section className="saving-zone">
        <h2 className="section-title">Super Saving Zone</h2>
        <Slider {...productSettings}>
          {discountedProducts.map((product) => renderAmazonStyleCard(product))}
        </Slider>
      </section>

      {/* Featured Products - Amazon-style slider */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <Slider {...productSettings}>
          {featuredProducts.map((product) => renderAmazonStyleCard(product))}
        </Slider>
      </section>

      {/* Unified Premium Products - Amazon-style slider (removed duplicate) */}
      <section className="premium-section">
        <h2 className="section-title">Premium Collection</h2>
        <Slider {...premiumSettings}>
          {premiumProducts.map((product) => renderAmazonStyleCard(product))}
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
          {trendingProducts.map((product) => renderAmazonStyleCard(product))}
        </Slider>
      </section>

      {/* Match For You - Amazon-style slider */}
      <section className="match-section">
        <h2 className="section-title">Recommended For You</h2>
        <Slider {...productSettings}>
          {matchForYou.map((product) => renderAmazonStyleCard(product))}
        </Slider>
      </section>

      {/* Beauty Products - Grid with Amazon cards */}
      <section className="beauty-section">
        <h2 className="section-title">Beauty Essentials</h2>
        {topBeautyProducts.length > 0 ? (
          <div className="beauty-grid">
            {topBeautyProducts.map((product) => renderGridAmazonCard(product))}
          </div>
        ) : (
          <div className="no-products">No beauty products available yet!</div>
        )}
      </section>
    </div>
  );
};

export default Home;