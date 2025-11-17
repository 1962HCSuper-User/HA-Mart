import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section: Newsletter & App Download */}
      <div className="footer-top">
        <div className="newsletter">
          <h3>Subscribe to Our Newsletter</h3>
          <p>Get the latest updates on products and offers.</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
        <div className="app-download">
          <h3>Download Our App</h3>
          <p>Shop anytime with our mobile app.</p>
          <div className="app-buttons">
            <a href="#"><img src="https://via.placeholder.com/120x40?text=App+Store" alt="App Store" /></a>
            <a href="#"><img src="https://via.placeholder.com/120x40?text=Google+Play" alt="Google Play" /></a>
          </div>
        </div>
      </div>

      {/* Middle Section: Links */}
      <div className="footer-middle">
        <div className="footer-section">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/press">Press</Link>
        </div>
        <div className="footer-section">
          <h4>Help & Support</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/returns">Returns</Link>
        </div>
        <div className="footer-section">
          <h4>Explore</h4>
          <Link to="/shop">Shop</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/gift-cards">Gift Cards</Link>
          <Link to="/coupons">Coupons</Link>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} H-Mart. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;