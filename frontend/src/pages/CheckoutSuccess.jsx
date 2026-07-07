import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Award, ShoppingBag, FileDown } from 'lucide-react';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const txnId = searchParams.get('txnId');
  const gateway = searchParams.get('gateway');

  // Trigger sound effect or similar if needed
  return (
    <div className="container" style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', border: '1px solid var(--accent)' }}>
        
        <div style={{ color: 'var(--accent)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={56} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Sourcing Order Confirmed!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
          Thank you for your purchase. Your payment has been securely processed and order recorded.
        </p>

        {/* Transaction details card */}
        <div className="glass-panel animate-fade-in-up" style={{ padding: '20px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', textAlign: 'left', marginBottom: '24px' }}>
          <div>Order ID: <strong style={{ color: 'var(--text-primary)' }}>{orderId || 'ORD-UNKNOWN'}</strong></div>
          {txnId && <div>Transaction Reference: <strong style={{ color: 'var(--text-primary)' }}>{txnId}</strong></div>}
          <div>Payment Gateway: <strong style={{ color: 'var(--text-primary)' }}>{gateway || 'Cash on Delivery'}</strong></div>
          <div>Estimated Delivery: <strong style={{ color: 'var(--accent)' }}>2 - 3 Working Days</strong></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: 'var(--text-muted)' }}>
            <Award size={14} style={{ color: 'var(--accent)' }} /> 
            <span>You have earned reward points on this purchase!</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ flexGrow: 1, padding: '10px', fontSize: '0.9rem' }}>
            Track in Dashboard
          </Link>
          <a href={`/api/orders/${orderId}/invoice`} download className="btn btn-secondary" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', padding: '10px', fontSize: '0.9rem' }}>
            <FileDown size={16} /> Invoice
          </a>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Return to Homepage</Link>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSuccess;
