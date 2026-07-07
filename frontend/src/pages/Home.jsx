import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import VehicleFilter from '../components/VehicleFilter';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star,
  ArrowRight,
  Send
} from 'lucide-react';

const Home = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch CMS blocks
        const [heroRes, testRes, blogRes, faqRes, catRes, brandRes, prodRes] = await Promise.all([
          fetch('/api/cms/hero_slider'),
          fetch('/api/cms/testimonials'),
          fetch('/api/cms/blogs'),
          fetch('/api/cms/faqs'),
          fetch('/api/products/categories'),
          fetch('/api/products/brands'),
          fetch('/api/products?limit=8') // Popular/latest parts
        ]);

        const hero = await heroRes.json();
        const test = await testRes.json();
        const blog = await blogRes.json();
        const faq = await faqRes.json();
        const cat = await catRes.json();
        const brand = await brandRes.json();
        const prod = await prodRes.json();

        if (hero.success) setHeroSlides(hero.value);
        if (test.success) setTestimonials(test.value);
        if (blog.success) setBlogs(blog.value);
        if (faq.success) setFaqs(faq.value);
        if (cat.success) setCategories(cat.categories);
        if (brand.success) setBrands(brand.brands);
        if (prod.success) setFeaturedProducts(prod.products);

      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Slide loop timer
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };
  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* Hero Banner Slider */}
      {heroSlides.length > 0 && (
        <div style={{
          position: 'relative',
          height: '420px',
          background: '#000000',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)'
        }} className="hero-slider">
          
          {/* Slides */}
          {heroSlides.map((slide, idx) => (
            <div 
              key={idx}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `linear-gradient(to right, rgba(15, 17, 19, 0.95), rgba(15, 17, 19, 0.4)), url(${slide.image || '/uploads/products/banner1.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                padding: '0 60px',
                opacity: idx === currentSlide ? 1 : 0,
                visibility: idx === currentSlide ? 'visible' : 'hidden',
                transition: 'opacity var(--transition-slow), visibility var(--transition-slow)'
              }}
            >
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
                <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>Original Auto Parts</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: '1.2' }}>{slide.title}</h1>
                <p style={{ fontSize: '1.1rem', color: '#CED4DA' }}>{slide.subtitle}</p>
                <RouterLink to={slide.link || '/shop'} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                  Shop Compatible Parts <ArrowRight size={18} />
                </RouterLink>
              </div>
            </div>
          ))}

          {/* Slider controls */}
          <button onClick={handlePrevSlide} style={{
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNextSlide} style={{
            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Vehicle Sourcing Finder Widget */}
      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <VehicleFilter />
      </div>

      {/* Featured Categories */}
      <div className="container">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} style={{ color: 'var(--accent)' }} /> Featured Spare Categories
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px'
        }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card skeleton" style={{ height: '140px' }} />
            ))
          ) : (
            categories.map(cat => (
              <RouterLink key={cat._id} to={`/shop?category=${cat.slug}`} className="glass-card" style={{
                padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800
                }}>
                  {cat.name[0]}
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.subcategories?.length || 0} subparts</span>
                </div>
              </RouterLink>
            ))
          )}
        </div>
      </div>

      {/* Popular Brands */}
      <div className="container">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>Genuine Vehicle Manufacturers</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {brands.map(brand => (
            <RouterLink key={brand._id} to={`/shop?brand=${brand.slug}`} className="glass-panel" style={{
              padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              fontSize: '1.1rem', color: 'var(--text-primary)', minWidth: '160px', transition: 'border-color var(--transition-fast)'
            }}>
              {brand.name}
            </RouterLink>
          ))}
        </div>
      </div>

      {/* Products Display (Popular Parts) */}
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Popular Spare Parts</h2>
          <RouterLink to="/shop" style={{ color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Catalog <ArrowRight size={16} />
          </RouterLink>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            featuredProducts.slice(0, 4).map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))
          )}
        </div>
      </div>

      {/* Today's offers Banner */}
      <div className="container">
        <div className="glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(255,107,0,0.1) 0%, rgba(15,17,19,0.05) 100%)',
          padding: '40px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '10px' }}>Coupon Promotion</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>First Time Buying? Save 10%</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Use promo code <strong style={{ color: 'var(--accent)' }}>WELCOME10</strong> at checkout. Minimum purchase Rs. 1,000.</p>
          </div>
          <RouterLink to="/shop" className="btn btn-primary">Redeem Coupon Now</RouterLink>
        </div>
      </div>

      {/* Why Choose SpareX */}
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Why Buy From SpareX?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px auto' }}>We provide high fidelity vehicle matching to eliminate returns and guarantee parts fitment.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Chassis Number Matching</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Provide your chassis number (VIN) and our engineers double check alignment on Japanese catalogs.</p>
          </div>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Direct Importers</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We import directly from trusted Japanese auction houses and certified OEM suppliers.</p>
          </div>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Secure Payment Escrow</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pay safely with Stripe, PayPal, local PayHere gateway or select cash on delivery.</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Testimonials */}
      {testimonials.length > 0 && (
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>What Sri Lankan Owners Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((test, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', color: '#f1c40f' }}>
                  {Array.from({ length: test.rating }).map((_, i) => <Star key={i} size={16} fill="#f1c40f" />)}
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
                  "{test.comment}"
                </p>
                <div>
                  <h5 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{test.name}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Blog Articles */}
      {blogs.length > 0 && (
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px' }}>Automotive Care Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {blogs.map((blog, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                <div style={{ height: '180px', background: 'var(--bg-tertiary)' }} />
                <div style={{ padding: '0 24px 24px 24px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{blog.date}</span>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '6px 0 10px 0', color: 'var(--text-primary)' }}>{blog.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>{blog.summary}</p>
                  <RouterLink to="/shop" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Article <ArrowRight size={14} />
                  </RouterLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{faq.question}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter signup */}
      <div className="container">
        <div className="glass-panel" style={{
          padding: '40px',
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Stay Updated on Sourcing Batches</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '16px' }}>
            Subscribe to receive alerts when container loads arrive from Japan with fresh auto components.
          </p>
          {newsletterSubscribed ? (
            <div className="badge badge-success" style={{ padding: '8px 16px' }}>Thank you for subscribing! Check your email.</div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                className="form-control"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{ flexGrow: 1, borderRadius: '24px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '24px', padding: '0 24px' }}>
                <Send size={16} /> <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;
