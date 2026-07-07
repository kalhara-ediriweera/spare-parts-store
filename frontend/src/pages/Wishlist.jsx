import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{
          background: 'var(--accent-light)', color: 'var(--accent)',
          width: '80px', height: '80px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto'
        }}>
          <Heart size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Save items to your wishlist to purchase them later.</p>
        <Link to="/shop" className="btn btn-primary">Browse Parts</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Heart size={32} style={{ color: '#e74c3c' }} /> Saved Wishlist ({wishlistItems.length})
      </h1>

      <div className="grid" style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        {wishlistItems.map(item => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
