import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { 
  ShoppingCart, 
  Heart, 
  GitCompare, 
  Check, 
  Truck, 
  RotateCcw, 
  Star, 
  ShieldAlert,
  Sliders,
  Award
} from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { addCartItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery state
  const [activeImage, setActiveImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomBackground, setZoomBackground] = useState('');
  
  const [qty, setQty] = useState(1);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.product);
          setReviews(data.reviews || []);
          setRelatedProducts(data.related || []);
          setActiveImage(data.product.images[0] || '/uploads/products/default.jpg');
        } else {
          setError(data.message || 'Product not found');
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleImageHover = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomBackground(`${x}% ${y}%`);
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleImageLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!user) {
      setReviewError('Please login to leave a review.');
      return;
    }

    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setReviewComment('');
        // Reload reviews
        setReviews(prev => [data.review, ...prev]);
      } else {
        setReviewError(data.message || 'Review failed.');
      }
    } catch (err) {
      setReviewError('Failed to submit review.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '16px' }}>Loading Parts details...</h3>
        <div className="skeleton" style={{ width: '100px', height: '100px', margin: '0 auto' }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '12px' }}>{error || 'Part not found'}</h3>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">Return to Catalog</button>
      </div>
    );
  }

  const isWished = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* Product Details Header */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '40px'
        }} className="product-details-grid">
          
          {/* Left: Image Zoom Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              style={{
                position: 'relative',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'zoom-in',
                paddingTop: '75%' // 4:3 Aspect Ratio
              }}
              onMouseMove={handleImageHover}
              onMouseLeave={handleImageLeave}
            >
              <img 
                src={activeImage} 
                alt={product.title}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  objectFit: 'contain'
                }}
              />
              {/* Zoom overlay lens */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200%',
                  pointerEvents: 'none',
                  ...zoomStyle
                }}
              />
            </div>

            {/* Thumbnail switcher list */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      border: activeImage === img ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: 'var(--bg-secondary)',
                      padding: '4px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Details Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-accent">{product.brand ? product.brand.name : 'GENUINE'}</span>
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={12} /> {product.condition}
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>{product.title}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                <div style={{ display: 'flex', color: '#f1c40f' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.round(product.ratingAverage) ? '#f1c40f' : 'none'} 
                      color="#f1c40f"
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({product.numReviews} customer reviews)</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', padding: '4px 0' }} />

            {/* Pricing block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>
                Rs. {(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
              </span>
              {product.discountPrice > 0 && (
                <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <span style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: product.stock > 0 ? '#2ecc71' : '#e74c3c'
              }} />
              <span style={{ fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock / Direct Order'}
              </span>
            </div>

            {/* Tech metadata card */}
            <div className="glass-panel" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>Part Number: <strong style={{ color: 'var(--text-primary)' }}>{product.partNumber}</strong></div>
              <div>OEM Number: <strong style={{ color: 'var(--text-primary)' }}>{product.oemNumber || 'N/A'}</strong></div>
              <div>SKU: <strong style={{ color: 'var(--text-primary)' }}>{product.sku}</strong></div>
              <div>Warranty: <strong style={{ color: 'var(--text-primary)' }}>{product.warranty}</strong></div>
              <div>Origin: <strong style={{ color: 'var(--text-primary)' }}>{product.originCountry}</strong></div>
              <div>Weight: <strong style={{ color: 'var(--text-primary)' }}>{product.shippingDetails.weight} kg</strong></div>
            </div>

            {/* Part Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{product.description}</p>

            {/* Sourcing Quantity & Action CTAs */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800 }}>-</button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800 }}>+</button>
                </div>

                <button 
                  onClick={() => addCartItem(product, qty)} 
                  className="btn btn-primary"
                  style={{ flexGrow: 1, height: '46px' }}
                >
                  <ShoppingCart size={18} /> Add to Shopping Cart
                </button>
              </div>
            )}

            {/* Quick utility flags */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={() => toggleCompare(product)}
                className="btn btn-secondary"
                style={{
                  flexGrow: 1, padding: '10px', fontSize: '0.85rem',
                  borderColor: isCompared ? 'var(--accent)' : 'var(--border)',
                  color: isCompared ? 'var(--accent)' : 'var(--text-primary)'
                }}
              >
                <GitCompare size={16} /> Compare Specs
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className="btn btn-secondary"
                style={{
                  flexGrow: 1, padding: '10px', fontSize: '0.85rem',
                  borderColor: isWished ? '#e74c3c' : 'var(--border)',
                  color: isWished ? '#e74c3c' : 'var(--text-primary)'
                }}
              >
                <Heart size={16} fill={isWished ? '#e74c3c' : 'none'} /> Saved Wishlist
              </button>
            </div>

            {/* Trust factors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#2ecc71" /> Double-checked fitment compatibility guaranteed.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={16} color="var(--accent)" /> Colombo delivery Rs. 350, Outstation delivery Rs. 550.</div>
            </div>

          </div>

        </div>
      </div>

      {/* Compatibility & Specifications Tabs */}
      <div className="container">
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Specifications Table */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Part Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{spec.key}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{spec.value}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Standard OEM specifications apply.</div>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)' }} />

          {/* Compatibility List */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Compatible Vehicle Models</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Compatible Years</th>
                    <th>Engine Code</th>
                    <th>Transmission</th>
                    <th>Fuel Type</th>
                  </tr>
                </thead>
                <tbody>
                  {product.compatibility && product.compatibility.length > 0 ? (
                    product.compatibility.map((comp, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{comp.make}</td>
                        <td>{comp.model}</td>
                        <td>{comp.yearStart} - {comp.yearEnd}</td>
                        <td>{comp.engine}</td>
                        <td>{comp.transmission}</td>
                        <td><span className="badge badge-accent" style={{ textTransform: 'none' }}>{comp.fuelType}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Universal part fitment. Fits most standard models.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Review Section */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }} className="product-details-grid">
          
          {/* Reviews Thread List */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Customer Reviews ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to review this genuine part!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{rev.userName}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', color: '#f1c40f', marginBottom: '8px' }}>
                      {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={12} fill="#f1c40f" color="#f1c40f" />)}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Form */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Leave a Review</h3>
            
            <form onSubmit={handleReviewSubmit} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviewSuccess && <div className="badge badge-success" style={{ padding: '8px 12px', width: '100%', justifyContent: 'center' }}>Review submitted successfully!</div>}
              {reviewError && <div className="badge badge-danger" style={{ padding: '8px 12px', width: '100%', justifyContent: 'center' }}>{reviewError}</div>}
              
              <div className="form-group">
                <label className="form-label">Rating Value</label>
                <select 
                  value={reviewRating} 
                  onChange={(e) => setReviewRating(Number(e.target.value))} 
                  className="form-control"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Bad)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea 
                  rows="4" 
                  placeholder="Share details of your vehicle fitment experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Review</button>
            </form>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Frequently Bought Together / Related Parts</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {relatedProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
