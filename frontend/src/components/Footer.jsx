import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      color: 'var(--text-secondary)',
      padding: '60px 0 20px 0',
      marginTop: '80px'
    }}>
      <div className="container">
        
        {/* Core Value Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          paddingBottom: '40px',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', color: 'var(--accent)' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>100% Genuine Parts</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Guaranteed compatibility and manufacturer warranty.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', color: 'var(--accent)' }}>
              <Truck size={28} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Island-wide Delivery</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fast delivery across all Sri Lankan districts.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', color: 'var(--accent)' }}>
              <RotateCcw size={28} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Easy Return Policy</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Returns accepted within 7 days for unused parts.</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          paddingBottom: '40px'
        }}>
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1.4rem' }}>SPAREX</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              Sri Lanka's leading digital marketplace for certified, original automotive vehicle spare parts. Direct import Japanese components.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>Store Directory</h4>
            <Link to="/shop" style={{ fontSize: '0.9rem', hover: 'color: var(--accent)' }}>Browse Catalog</Link>
            <Link to="/request-part" style={{ fontSize: '0.9rem' }}>Request Part</Link>
            <Link to="/compare" style={{ fontSize: '0.9rem' }}>Compare Parts</Link>
            <Link to="/shop?condition=Reconditioned" style={{ fontSize: '0.9rem' }}>Reconditioned Parts</Link>
          </div>

          {/* Customer Support Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>Service & Support</h4>
            <Link to="/dashboard" style={{ fontSize: '0.9rem' }}>My Account</Link>
            <Link to="/track-order" style={{ fontSize: '0.9rem' }}>Track Order Status</Link>
            <Link to="/faqs" style={{ fontSize: '0.9rem' }}>Frequently Asked FAQs</Link>
            <Link to="/tickets" style={{ fontSize: '0.9rem' }}>Help Tickets</Link>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Get In Touch</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <Phone size={16} style={{ color: 'var(--accent)' }} />
              <span>077-255-7541 | 033-232-0978</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <Mail size={16} style={{ color: 'var(--accent)' }} />
              <span>support@sparex.lk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '0.9rem' }}>
              <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <span>No. 88/8/2, Baseline Road, Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Footer Sub-bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} SpareX Sri Lanka. All Rights Reserved. Designed for premium automotive performance.
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>Stripe</span>
            <span>•</span>
            <span>PayPal</span>
            <span>•</span>
            <span>PayHere Ready</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
