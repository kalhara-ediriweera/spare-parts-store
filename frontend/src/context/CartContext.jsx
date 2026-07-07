import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('sparex_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const [pointsRedeemed, setPointsRedeemed] = useState(0); // loyalty points redeemed
  const [shippingDistrict, setShippingDistrict] = useState('Colombo');

  useEffect(() => {
    localStorage.setItem('sparex_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addCartItem = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.product === product._id);
      if (exists) {
        return prevItems.map(item =>
          item.product === product._id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prevItems,
        {
          product: product._id,
          title: product.title,
          partNumber: product.partNumber,
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
          image: product.images[0] || '',
          stock: product.stock,
          quantity
        }
      ];
    });
  };

  const updateCartItemQty = (productId, qty) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product === productId
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeCartItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.product !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setPointsRedeemed(0);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await fetch('/api/payments/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setCoupon({
          code: data.code,
          discountType: data.discountType,
          discountAmount: data.discountAmount
        });
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => setCoupon(null);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Sri Lanka shipping fee calculations
  // Colombo/Gampaha/Kalutara: Rs. 350. Others: Rs. 550. Free shipping over Rs. 30,000
  const shippingFee = subtotal === 0 || subtotal >= 30000 
    ? 0 
    : ['colombo', 'gampaha', 'kalutara'].includes(shippingDistrict.toLowerCase())
      ? 350
      : 550;

  // Taxes (SSCL & VAT: 15% placeholder)
  const tax = Math.round(subtotal * 0.15);

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'Percentage') {
      discount = Math.round(subtotal * (coupon.discountAmount / 100));
    } else {
      discount = coupon.discountAmount;
    }
  }

  // Add points redemption value (1 point = 1 LKR)
  if (pointsRedeemed > 0) {
    discount += pointsRedeemed;
  }

  const total = Math.max(0, subtotal + shippingFee + tax - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addCartItem,
        updateCartItemQty,
        removeCartItem,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        pointsRedeemed,
        setPointsRedeemed,
        shippingDistrict,
        setShippingDistrict,
        subtotal,
        shippingFee,
        tax,
        discount,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
