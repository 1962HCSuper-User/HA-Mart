import React from "react";
import "./ProductView.css";

export default function ProductPage() {
  return (
    <div className="page-wrapper">
      {/* MAIN CONTAINER */}
      <div className="page-container">
        
        {/* LEFT SIDE IMAGES */}
        <div>
          <div className="thumb-list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="thumb-item">
                <img
                  src={`https://via.placeholder.com/200?text=Img+${i}`}
                  alt="thumb"
                />
              </div>
            ))}
          </div>
          {/* MAIN IMAGE */}
          <div className="main-image">
            <img
              src="https://via.placeholder.com/600?text=Main+Product"
              alt="main"
            />
          </div>
        </div>
        {/* PRODUCT DETAILS */}
        <div>
          <h1 className="product-title">
            Nervfit Orion S1 Smartwatch 1.43" AMOLED Display with AOD, Functional Crown,
            Bluetooth Calling, AI Voice, IP68 Waterproof, Heart Rate & SpO2 Monitor
          </h1>
          <div className="rating-box">
            <span className="rating-stars">★★★★☆</span>
            <span className="rating-link">3 ratings</span>
            <span className="amz-choice">Amazon's Choice</span>
          </div>
          <div className="price-section">
            <span className="price">-88% ₹2,249</span>
            <span className="mrp">₹17,999</span>
            <p>Inclusive of all taxes</p>
          </div>
          {/* Offers */}
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
        {/* BUY BOX */}
        <div className="buy-box">
          <p className="buy-price">₹2,249.00</p>
          <p className="buy-mrp">₹17,999.00</p>
          <p>FREE Delivery Tomorrow</p>
          <button className="buy-btn add-cart">Add to Cart</button>
          <button className="buy-btn buy-now">Buy Now</button>
          <div className="buy-info">
            <p><b>Ships from:</b> Amazon</p>
            <p><b>Sold by:</b> Bluemorph Brands</p>
            <p><b>Payment:</b> Secure transaction</p>
          </div>
        </div>
      </div>

      {/* OFFER BADGE AND PRICE SUMMARY (MOVED FROM BOTTOM) */}
      <div className="offer-badge">Limited Time Deal</div>
      <div className="price-summary">
        <span className="price">₹999</span>
        <span className="mrp">₹2490</span>
      </div>
      <div className="discount-text">60% off</div>
      <div className="label">Inclusive of all taxes</div>

      {/* FULL-WIDTH SECTIONS BELOW MAIN GRID */}
      <div className="full-width-section">
        {/* FREQUENTLY BOUGHT TOGETHER */}
        <div className="section">
          <h2 className="section-title">Frequently bought together</h2>
          <div className="bundle-grid">
            <div className="bundle-item">
              <img src="https://via.placeholder.com/150?text=Product+1" alt="Bundle 1" />
              <p>Nervfit Orion S1 Smartwatch</p>
              <span className="bundle-price">₹2,249</span>
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
          <p className="bundle-total">Total: ₹2,747 <span className="save-text">(Save ₹150)</span></p>
          <button className="bundle-btn">Add these 3 items to cart</button>
        </div>

        {/* WHAT DO CUSTOMERS BUY AFTER VIEWING THIS ITEM? */}
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

        {/* WHAT'S IN THE BOX */}
        <div className="section">
          <h2 className="section-title">What's in the box?</h2>
          <ul className="box-list">
            <li>Smartwatch</li>
            <li>Charging Cable</li>
            <li>User Manual</li>
            <li>Warranty Card</li>
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
              <tr>
                <td>Brand: Nervfit</td>
                <td>ASIN: B0ABC123</td>
              </tr>
              <tr>
                <td>Display: 1.43" AMOLED</td>
                <td>Weight: 45g</td>
              </tr>
              <tr>
                <td>Battery: 300mAh</td>
                <td>Dimensions: 45x45x12mm</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRODUCT DESCRIPTION */}
        <div className="section">
          <h2 className="section-title">Product description</h2>
          <p className="description-text">
            The Nervfit Orion S1 Smartwatch features a stunning 1.43" AMOLED display with Always-On Display (AOD) for easy viewing. 
            Enjoy seamless Bluetooth calling, AI voice assistance, and IP68 waterproof rating. Monitor your heart rate and SpO2 levels effortlessly.
          </p>
          <div className="description-images">
            {[1, 2, 3].map((i) => (
              <img key={i} src={`https://via.placeholder.com/300?text=Desc+Img+${i}`} alt={`Desc ${i}`} />
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-card">
                <img src={`https://via.placeholder.com/200?text=Also+Bought+${i}`} alt={`Also bought ${i}`} />
                <p>Also Bought Product {i}</p>
                <span className="card-price">₹{800 + i * 200}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS RELATED TO THIS ITEM */}
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

        {/* ADDITIONAL ITEMS TO EXPLORE */}
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

        {/* MORE ITEMS TO CONSIDER */}
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

        {/* SEE PERSONALIZED RECOMMENDATIONS */}
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