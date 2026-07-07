import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, 
  Heart, 
  GitCompare, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  Shield, 
  Sliders, 
  MessageSquare,
  Search
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { compareItems } = useCompare();
  const { darkMode, toggleTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '12px 0',
      background: 'var(--bg-glass)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'var(--accent)',
            color: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '1px'
          }}>
            SPARE<span style={{ color: '#000000' }}>X</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form" style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '4px 16px',
          width: '35%',
          maxWidth: '450px'
        }}>
          <input 
            type="text" 
            placeholder="Search by part number, OEM or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              width: '100%',
              padding: '6px 0',
              fontSize: '0.9rem'
            }}
          />
          <button type="submit" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <Search size={18} />
          </button>
        </form>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-actions">
          
          <Link to="/shop" style={{ fontWeight: 600, color: 'var(--text-secondary)', marginRight: '16px' }}>Shop</Link>
          <Link to="/request-part" style={{ fontWeight: 600, color: 'var(--text-secondary)', marginRight: '16px' }}>Request a Part</Link>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="btn-secondary" style={{ border: 'none', cursor: 'pointer', display: 'flex', padding: '8px', borderRadius: '50%' }}>
            {darkMode ? <Sun size={20} color="#FFD43B" /> : <Moon size={20} />}
          </button>

          {/* Compare */}
          <Link to="/compare" style={{ position: 'relative', display: 'flex', padding: '8px', color: 'var(--text-secondary)' }}>
            <GitCompare size={20} />
            {compareItems.length > 0 && (
              <span className="badge badge-accent" style={{
                position: 'absolute', top: -4, right: -4, padding: '2px 6px', fontSize: '0.65rem'
              }}>{compareItems.length}</span>
            )}
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" style={{ position: 'relative', display: 'flex', padding: '8px', color: 'var(--text-secondary)' }}>
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="badge badge-accent" style={{
                position: 'absolute', top: -4, right: -4, padding: '2px 6px', fontSize: '0.65rem'
              }}>{wishlistItems.length}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', padding: '8px', color: 'var(--text-secondary)' }}>
            <ShoppingBag size={20} />
            {totalCartQty > 0 && (
              <span className="badge" style={{
                position: 'absolute', top: -4, right: -4, padding: '2px 6px', fontSize: '0.65rem',
                backgroundColor: 'var(--accent)', color: '#FFFFFF'
              }}>{totalCartQty}</span>
            )}
          </Link>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }}
                >
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="avatar" 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}>{user.name[0]}</div>
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown Panel */}
                {userDropdownOpen && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    width: '200px',
                    padding: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <Link to="/dashboard" onClick={() => setUserDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.9rem' }}>
                      <UserIcon size={16} /> My Profile
                    </Link>
                    {['Super Admin', 'Admin', 'Manager', 'Inventory Staff', 'Customer Support'].includes(user.role) && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.9rem', color: 'var(--accent)' }}>
                        <Shield size={16} /> Admin Portal
                      </Link>
                    )}
                    <div style={{ borderTop: '1px solid var(--border-light)', margin: '4px 0' }} />
                    <button 
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        textAlign: 'left',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px', borderRadius: '20px', fontSize: '0.9rem' }}>
                <UserIcon size={16} /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="mobile-toggle"
          style={{
            display: 'none',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="glass-panel mobile-drawer animate-fade-in-up" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '16px 24px',
          borderLeft: 'none',
          borderRight: 'none',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Shop Parts</Link>
          <Link to="/request-part" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Request Sourcing</Link>
          <Link to="/compare" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Compare Items ({compareItems.length})</Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Wishlist ({wishlistItems.length})</Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Shopping Cart ({totalCartQty})</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Profile Account</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ background: 'transparent', border: 'none', textAlign: 'left', fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">Login Account</Link>
          )}
        </div>
      )}

      {/* Embed responsive media styles */}
      <style>{`
        @media (max-width: 768px) {
          .search-form {
            display: none !important;
          }
          .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
