import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const CheckoutCancel = () => {
  return (
    <div className="container" style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '40px', textAlign: 'center' }}>
        
        <div style={{ color: '#e74c3c', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <ShieldAlert size={56} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Payment Cancelled</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
          The transaction session was cancelled. No charges were made to your card.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/cart" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', justifyContent: 'center' }}>
            <ArrowLeft size={16} /> Return to Shopping Cart
          </Link>
          <Link to="/shop" className="btn btn-secondary">Continue Browsing Catalog</Link>
        </div>

      </div>
    </div>
  );
};

export default CheckoutCancel;
