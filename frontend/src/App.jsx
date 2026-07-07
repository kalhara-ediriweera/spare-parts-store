import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import RequestPart from './pages/RequestPart';
import AdminDashboard from './pages/admin/AdminDashboard';

// Custom CSS styling imports
import './styles/index.css';
import './styles/dashboard.css';

// Layout Helper to hide default Navbar/Footer on Admin paths
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminPath && <Navbar />}
      
      <main style={{ flexGrow: 1, padding: !isAdminPath ? '20px 0' : '0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<RouteHelper><Cart /></RouteHelper>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/request-part" element={<RequestPart />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
};

// Route wrapper helper to ensure clean routing
const RouteHelper = ({ children }) => {
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
