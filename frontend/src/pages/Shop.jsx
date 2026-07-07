import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { SlidersHorizontal, Search, Grid, List, X, Star } from 'lucide-react';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Search parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialMake = queryParams.get('make') || '';
  const initialModel = queryParams.get('model') || '';
  const initialYear = queryParams.get('year') || '';
  const initialEngine = queryParams.get('engine') || '';
  const initialCategory = queryParams.get('category') || '';
  const initialBrand = queryParams.get('brand') || '';

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [make, setMake] = useState(initialMake);
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState(initialYear);
  const [engine, setEngine] = useState(initialEngine);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Dropdowns lists (loaded from API filter aggregator)
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    models: {},
    years: [],
    engines: []
  });
  const [categoriesList, setCategoriesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);

  // Fetch filter options once
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [filtersRes, catsRes, brandsRes] = await Promise.all([
          fetch('/api/products/filters'),
          fetch('/api/products/categories'),
          fetch('/api/products/brands')
        ]);
        const filterData = await filtersRes.json();
        const catsData = await catsRes.json();
        const brandsData = await brandsRes.json();

        if (filterData.success) {
          setFilterOptions({
            makes: filterData.makes || [],
            models: filterData.models || {},
            years: filterData.years || [],
            engines: filterData.engines || []
          });
        }
        if (catsData.success) setCategoriesList(catsData.categories);
        if (brandsData.success) setBrandsList(brandsData.brands);
      } catch (err) {
        console.error('Error fetching filter values:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch products when filters or page change
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (make) params.append('make', make);
      if (model) params.append('model', model);
      if (year) params.append('year', year);
      if (engine) params.append('engine', engine);
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (condition) params.append('condition', condition);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (rating) params.append('rating', rating);
      if (sort) params.append('sort', sort);
      params.append('page', currentPage);
      params.append('limit', 9);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.count);
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, make, model, year, engine, category, brand, condition, minPrice, maxPrice, rating, sort]);

  // Handle manual search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  // Clear filters
  const resetFilters = () => {
    setSearch('');
    setMake('');
    setModel('');
    setYear('');
    setEngine('');
    setCategory('');
    setBrand('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSort('popular');
    setCurrentPage(1);
    navigate('/shop');
  };

  const modelsList = make ? filterOptions.models[make] || [] : [];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Genuine Parts Catalog</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Found {totalProducts} verified parts matching your search</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="form-control"
              style={{ padding: '8px 16px', fontSize: '0.9rem', width: '160px', cursor: 'pointer' }}
            >
              <option value="popular">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating Average</option>
              <option value="title-asc">Title: A to Z</option>
            </select>

            <div className="glass-panel" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
              <button 
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'var(--accent)' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
                  color: viewMode === 'list' ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Shop Content */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '30px',
          alignItems: 'start'
        }} className="shop-grid">
          
          {/* Filters Sidebar */}
          <aside className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button onClick={resetFilters} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Reset All</button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="form-group">
              <label className="form-label">Keyword Search</label>
              <div style={{ display: 'flex', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Keyword..." 
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: 'var(--text-secondary)' }}>
                  <Search size={16} />
                </button>
              </div>
            </form>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            {/* Vehicle Sourcing Compatibility Lookup */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Vehicle Sourcing Compatibility</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select value={make} onChange={(e) => { setMake(e.target.value); setModel(''); }} className="form-control" style={{ fontSize: '0.85rem' }}>
                  <option value="">Select Make</option>
                  {filterOptions.makes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="form-control" disabled={!make} style={{ fontSize: '0.85rem' }}>
                  <option value="">Select Model</option>
                  {modelsList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }}>
                  <option value="">Select Year</option>
                  {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            {/* Product Category Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Parts Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categoriesList.map(cat => (
                  <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="category" 
                      checked={category === cat.slug}
                      onChange={() => setCategory(cat.slug)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            {/* Manufacturer Brand Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Manufacturers</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brandsList.map(br => (
                  <label key={br._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={brand === br.slug}
                      onChange={() => setBrand(br.slug)}
                    />
                    <span>{br.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            {/* Condition Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Condition</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['New', 'Reconditioned', 'Used'].map(cond => (
                  <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={condition === cond}
                      onChange={() => setCondition(condition === cond ? '' : cond)}
                    />
                    <span>{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            {/* Price Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Price Range (Rs.)</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="form-control"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="form-control"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)' }} />

            {/* Ratings Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Ratings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[4, 3, 2].map(stars => (
                  <button 
                    key={stars} 
                    onClick={() => setRating(rating === stars ? '' : stars)}
                    style={{
                      background: rating === stars ? 'var(--accent-light)' : 'transparent',
                      border: 'none', padding: '6px 8px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textAlign: 'left', width: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', color: '#f1c40f' }}>
                      {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} fill="#f1c40f" />)}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>& Up</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Catalog Listing */}
          <div>
            {loading ? (
              <div className="grid" style={{ gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(250px, 1fr))' : '1fr', gap: '24px' }}>
                <SkeletonLoader count={6} type={viewMode === 'grid' ? 'card' : 'list'} />
              </div>
            ) : products.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No compatible spare parts found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 20px auto' }}>
                  If you cannot find the part, submit a chassis lookup request and we will source it directly.
                </p>
                <button onClick={() => navigate('/request-part')} className="btn btn-primary">Submit Part Request</button>
              </div>
            ) : (
              <>
                <div className="grid" style={{
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
                  gap: '24px'
                }}>
                  {products.map(prod => (
                    viewMode === 'grid' ? (
                      <ProductCard key={prod._id} product={prod} />
                    ) : (
                      <div className="glass-card" key={prod._id} style={{ display: 'flex', gap: '20px', padding: '16px', alignItems: 'center' }}>
                        <img src={prod.images[0]} alt={prod.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontWeight: 700 }}>{prod.title}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>Part No: {prod.partNumber}</p>
                          <span className="badge badge-accent">{prod.condition}</span>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '150px' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)', marginBottom: '8px' }}>Rs. {prod.price.toLocaleString()}</div>
                          <button onClick={() => navigate(`/products/${prod.slug}`)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>View Details</button>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                          width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                          background: currentPage === i + 1 ? 'var(--accent)' : 'var(--bg-secondary)',
                          color: currentPage === i + 1 ? '#FFFFFF' : 'var(--text-primary)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer', fontWeight: 600
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
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

export default Shop;
