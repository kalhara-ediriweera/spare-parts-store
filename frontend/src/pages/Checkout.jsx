import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, ShoppingBag, Loader, Award } from 'lucide-react';

const Checkout = () => {
  const {
    cartItems,
    clearCart,
    subtotal,
    shippingFee,
    tax,
    discount,
    total,
    coupon,
    pointsRedeemed,
    setPointsRedeemed,
    shippingDistrict,
    setShippingDistrict
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Guest Details form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Shipping Address Form
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState(shippingDistrict); // District
  const [postalCode, setPostalCode] = useState('');

  // Billing Address Form
  const [copyShipping, setCopyShipping] = useState(true);
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [redeemPointsChecked, setRedeemPointsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load default address if logged in
  useEffect(() => {
    if (user && user.addressBook && user.addressBook.length > 0) {
      const defaultAddr = user.addressBook.find(addr => addr.isDefault) || user.addressBook[0];
      setStreet(defaultAddr.street || '');
      setCity(defaultAddr.city || '');
      setState(defaultAddr.state || '');
      setShippingDistrict(defaultAddr.state || 'Colombo');
      setPostalCode(defaultAddr.postalCode || '');
    }
  }, [user]);

  // Keep state sync with district selector
  useEffect(() => {
    setState(shippingDistrict);
  }, [shippingDistrict]);

  // Handle reward points check
  const handlePointsCheckboxChange = (e) => {
    const checked = e.target.checked;
    setRedeemPointsChecked(checked);
    if (checked && user) {
      // Calculate how many points can be redeemed
      // Maximum points we can redeem is either all user points, or cart subtotal value
      const maxRedeemablePoints = Math.min(user.rewardPoints, subtotal);
      setPointsRedeemed(maxRedeemablePoints);
    } else {
      setPointsRedeemed(0);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    
    if (cartItems.length === 0) return;

    if (!user && (!guestName || !guestEmail || !guestPhone)) {
      setError('Please provide guest contact details.');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: {
          street,
          city,
          state: state,
          postalCode,
          country: 'Sri Lanka'
        },
        billingAddress: copyShipping ? {
          street,
          city,
          state: state,
          postalCode,
          country: 'Sri Lanka'
        } : {
          street: billingStreet,
          city: billingCity,
          state: billingState,
          postalCode: billingPostalCode,
          country: 'Sri Lanka'
        },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shippingFee,
        taxPrice: tax,
        discountPrice: discount,
        totalPrice: total,
        couponCode: coupon ? coupon.code : '',
        pointsRedeemed: pointsRedeemed,
        guestDetails: user ? undefined : {
          name: guestName,
          email: guestEmail,
          phone: guestPhone
        }
      };

      // 1. Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const orderResult = await orderRes.json();

      if (!orderResult.success) {
        setError(orderResult.message || 'Failed to place order.');
        setLoading(false);
        return;
      }

      const orderId = orderResult.order._id;

      // 2. Initiate mock payment redirect
      if (paymentMethod !== 'COD') {
        const paymentRes = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethod, amount: total, orderId })
        });
        const paymentResult = await paymentRes.json();

        if (paymentResult.success && paymentResult.paymentUrl) {
          clearCart();
          // Simulate loading redirect
          setTimeout(() => {
            navigate(paymentResult.paymentUrl);
          }, 1500);
        } else {
          setError('Payment session creation failed.');
          setLoading(false);
        }
      } else {
        // Cash on delivery - success page directly
        clearCart();
        navigate(`/checkout-success?orderId=${orderId}&gateway=COD`);
      }

    } catch (err) {
      setError('Checkout error occurred. Check connection.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>Secured Sourcing Checkout</h1>

      {error && <div className="badge badge-danger" style={{ padding: '10px 16px', marginBottom: '20px', width: '100%', justifyContent: 'center' }}>{error}</div>}

      <form onSubmit={handlePlaceOrder} style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }} className="shop-grid">
        
        {/* Left Form: Shipping and Billing Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Guest Contact Details */}
          {!user && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required className="form-control" />
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} style={{ color: 'var(--accent)' }} /> Delivery Address (Sri Lanka)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Street Address / House No</label>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required className="form-control" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">City / Town</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">District State</label>
                  <select 
                    value={shippingDistrict} 
                    onChange={(e) => setShippingDistrict(e.target.value)} 
                    className="form-control"
                    required
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Other">Other Outstations</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Postal Code</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="form-control" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} style={{ color: 'var(--accent)' }} /> Payment Options
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'COD' ? 'var(--accent-light)' : 'transparent' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Cash on Delivery (COD)</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay in LKR when our dispatch rider delivers the items.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'Stripe' ? 'var(--accent-light)' : 'transparent' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'Stripe'} onChange={() => setPaymentMethod('Stripe')} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Card Payment (Stripe Secure)</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visa, MasterCard, Amex international cards.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'PayHere' ? 'var(--accent-light)' : 'transparent' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'PayHere'} onChange={() => setPaymentMethod('PayHere')} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>PayHere Gateway (Local Bank Cards)</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay using Sri Lankan debit cards, eZ Cash, mCash, or Genie.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'PayPal' ? 'var(--accent-light)' : 'transparent' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'PayPal'} onChange={() => setPaymentMethod('PayPal')} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>PayPal Checkout</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay with international PayPal account.</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Order Checkout calculations */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Checkout Summary</h3>

            {/* Loyalty points rewards box */}
            {user && user.rewardPoints > 0 && (
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px dashed var(--accent)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'start',
                gap: '8px'
              }}>
                <input 
                  type="checkbox" 
                  id="points" 
                  checked={redeemPointsChecked}
                  onChange={handlePointsCheckboxChange}
                  style={{ marginTop: '3px' }}
                />
                <label htmlFor="points" style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={14} style={{ color: 'var(--accent)' }} /> Redeem Reward Points</span>
                  <span style={{ color: 'var(--text-muted)' }}>You have <strong>{user.rewardPoints}</strong> points (1 point = 1 LKR).</span>
                </label>
              </div>
            )}

            {/* Subtotals list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Total</span>
                <strong>Rs. {subtotal.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
                <strong>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>VAT & Taxes (15%)</span>
                <strong>Rs. {tax.toLocaleString()}</strong>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71' }}>
                  <span>Discounts Applied</span>
                  <strong>-Rs. {discount.toLocaleString()}</strong>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--accent)' }}>Rs. {total.toLocaleString()}</span>
            </div>

            <button 
              type="submit" 
              disabled={loading || cartItems.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', display: 'flex', gap: '8px', marginTop: '10px' }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};

export default Checkout;
