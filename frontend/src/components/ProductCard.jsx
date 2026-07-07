import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { Heart, GitCompare, ShoppingCart, Info, Award } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addCartItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const isWished = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  const formattedPrice = (price) => {
    return 'Rs. ' + price.toLocaleString();
  };

  const hasDiscount = product.discountPrice > 0;
  const activePrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="glass-card animate-fade-in-up" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Badges / Discount */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {hasDiscount && (
          <span className="badge badge-accent">
            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </span>
        )}
        <span className="badge badge-success" style={{ textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={10} /> {product.condition}
        </span>
      </div>

      {/* Image Container */}
      <div style={{
        position: 'relative',
        paddingTop: '75%', // 4:3 Aspect Ratio
        background: 'var(--bg-tertiary)',
        overflow: 'hidden'
      }}>
        <img 
          src={product.images[0] || '/uploads/products/default.jpg'} 
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)'
          }}
          className="product-card-img"
        />
        {/* Quick action buttons overlay */}
        <div className="card-overlay" style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px',
          zIndex: 5
        }}>
          <button 
            onClick={() => toggleCompare(product)}
            title="Compare Specification"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isCompared ? 'var(--accent)' : 'var(--bg-secondary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompared ? '#FFFFFF' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <GitCompare size={16} />
          </button>
          <button 
            onClick={() => toggleWishlist(product)}
            title="Add to Wishlist"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isWished ? '#e74c3c' : 'var(--bg-secondary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWished ? '#FFFFFF' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Heart size={16} fill={isWished ? '#FFFFFF' : 'none'} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
            {product.brand ? product.brand.name : 'Genuine'}
          </span>
          <Link to={`/products/${product.slug}`}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '4px 0 8px 0',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '40px'
            }}>
              {product.title}
            </h3>
          </Link>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Part No: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{product.partNumber}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
              {formattedPrice(activePrice)}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                {formattedPrice(product.price)}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => addCartItem(product, 1)}
              disabled={product.stock === 0}
              className="btn btn-primary" 
              style={{
                flexGrow: 1,
                padding: '10px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <ShoppingCart size={16} /> 
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link 
              to={`/products/${product.slug}`} 
              className="btn btn-secondary" 
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Info size={16} />
            </Link>
          </div>
        </div>
      </div>
      
      <style>{`
        .glass-card:hover .product-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
