import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HeroSlider from "./components/HeroSlider.jsx";
import ProductCarousel from "./components/ProductCarousel.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/Cart.jsx";
import Profile from "./pages/Profile.jsx";
import OrdersReturns from "./pages/OrdersReturns.jsx";
import Shop from "./pages/Shop.jsx";
import Deals from "./pages/Deals.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProductRegister from "./pages/ProductRegister.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";  
import Inventory from "./pages/Inventory.jsx";
import ProductEdit from "./pages/ProductEdit.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import Home from "./components/Home.jsx";
import ProductVerification from "./pages/ProductVerification.jsx"; // ✅ import your admin page
import RoleChange from "./pages/AdminPage/AdminUserManager.jsx";
import AdminPanel from "./pages/AdminPage/AdminPanel.jsx";
import SellerPanel from "./pages/SellerPages/SellerPanel.jsx";
import ProductGrid from "./pages/ProductGrid.jsx";    
import ProductCard from "./pages/TestPoductCard.jsx";
import ProductTemplate from "./pages/ProductDegins/Templates/ProductView.jsx";
import ProductView from "./pages/ProductDegins/Templates/ProductView.jsx";
import ProductImages from "./pages/SellerPages/ProductImages.jsx";
import List_Products from "./pages/SellerPages/List_Product.jsx";
import "./App.css";

function App() {
  return (
    <Router>
  <Header />
  <main style={{ paddingTop: "140px" }}>
    <Routes>
      {/* <Route path="/" element={<><HeroSlider /><ProductCarousel /></>} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders-returns" element={<OrdersReturns />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/product-register" element={<ProductRegister />} />
      <Route path="/product-details/:product_id" element={<ProductDetails />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/product-edit/:product_id" element={<ProductEdit />} />
      <Route path="/product-details/:id" element={<EditProduct />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin/product-verification" element={<ProductVerification />} />
      <Route path="/admin/role-change" element={<RoleChange />} />
     <Route path="/admin" element={<AdminPanel />} />
      <Route path="/seller" element={<SellerPanel />} />
      <Route path="/product-grid" element={<ProductGrid />} />
      <Route path="/product-card" element={<ProductCard />} />
      <Route path="/product-template" element={<ProductTemplate />} />
      <Route path="/product/:id" element={<ProductView />} />
      <Route path="/product-images/:product_id" element={<ProductImages />} />
      <Route path="/list-products" element={<List_Products />} />

    </Routes>
  </main>
  <Footer />
</Router>
  );
}

export default App;
