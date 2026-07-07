import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, Ticket, Percent } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    updateCartItemQty,
    removeCartItem,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    shippingFee,
    tax,
    discount,
    total,
    shippingDistrict,
    setShippingDistrict
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleCouponApply = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);
    
    if (!couponCode.trim()) return;

    const result = await applyCoupon(couponCode);
    if (result.success) {
      setCouponSuccess(true);
      setCouponCode('');
    } else {
      setCouponError(result.message || 'Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{
          background: 'var(--accent-light)', color: 'var(--accent)',
          width: '80px', height: '80px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto'
        }}>
          <ShoppingCart size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Keep your vehicle running like new with SpareX components.</p>
        <Link to="/shop" className="btn btn-primary">Browse Genuine Parts</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShoppingCart size={32} style={{ color: 'var(--accent)' }} /> Shopping Cart ({cartItems.length} items)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }} className="shop-grid">
        
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.map((item) => (
            <div 
              key={item.product}
              className="glass-panel"
              style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <img 
                src={item.image || '/uploads/products/default.jpg'} 
                alt={item.title}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />

              <div style={{ flexGrow: 1, minWidth: '200px' }}>
                <Link to={`/products/${item.product}`}>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Part No: <span style={{ fontWeight: 600 }}>{item.partNumber}</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Rs. {item.price.toLocaleString()}
              </div>

              {/* Quantity Changer */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}>
                <button onClick={() => updateCartItemQty(item.product, item.quantity - 1)} style={{ padding: '6px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800 }}>-</button>
                <span style={{ width: '30px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <button onClick={() => updateCartItemQty(item.product, item.quantity + 1)} style={{ padding: '6px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800 }}>+</button>
              </div>

              {/* Total Row Amount */}
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--accent)', minWidth: '100px', textAlign: 'right' }}>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </div>

              {/* Delete */}
              <button 
                onClick={() => removeCartItem(item.product)}
                style={{
                  background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '6px'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Continue shopping link */}
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 600, fontSize: '0.95rem', marginTop: '10px' }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Right: Summary Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Order Summary Box */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Order Summary</h3>

            {/* Delivery District Selector */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Delivery District</label>
              <select 
                value={shippingDistrict} 
                onChange={(e) => setShippingDistrict(e.target.value)}
                className="form-control"
                style={{ cursor: 'pointer' }}
              >
                <option value="Colombo">Colombo (Rs. 350)</option>
                <option value="Gampaha">Gampaha (Rs. 350)</option>
                <option value="Kalutara">Kalutara (Rs. 350)</option>
                <option value="Kandy">Kandy (Rs. 550)</option>
                <option value="Galle">Galle (Rs. 550)</option>
                <option value="Kurunegala">Kurunegala (Rs. 550)</option>
                <option value="Other">Other Outstations (Rs. 550)</option>
              </select>
            </div>

            {/* Calculations items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <strong>Rs. {subtotal.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
                <strong>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>SSCL & VAT (15%)</span>
                <strong>Rs. {tax.toLocaleString()}</strong>
              </div>
              
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Percent size={14} /> Total Discount</span>
                  <strong>-Rs. {discount.toLocaleString()}</strong>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--accent)' }}>Rs. {total.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', fontSize: '1rem', marginTop: '10px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Coupon Code Applying Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ticket size={16} style={{ color: 'var(--accent)' }} /> Promo Coupon Code
            </h4>
            
            {coupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <strong style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>{coupon.code}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    ({coupon.discountType === 'Percentage' ? `${coupon.discountAmount}% off` : `Rs. ${coupon.discountAmount} off`})
                  </span>
                </div>
                <button onClick={removeCoupon} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Remove</button>
              </div>
            ) : (
              <form onSubmit={handleCouponApply} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Enter code..." 
                  className="form-control"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flexGrow: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0 16px', fontSize: '0.85rem' }}>Apply</button>
              </form>
            )}

            {couponSuccess && <div className="badge badge-success" style={{ marginTop: '8px', padding: '6px', width: '100%', justifyContent: 'center' }}>Promo code applied!</div>}
            {couponError && <div className="badge badge-danger" style={{ marginTop: '8px', padding: '6px', width: '100%', justifyContent: 'center' }}>{couponError}</div>}
          </div>

        </div>

      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .shop-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
