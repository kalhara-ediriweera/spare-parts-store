import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { GitCompare, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';

const Compare = () => {
  const { compareItems, toggleCompare, clearCompare } = useCompare();
  const { addCartItem } = useCart();
  const navigate = useNavigate();

  if (compareItems.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{
          background: 'var(--accent-light)', color: 'var(--accent)',
          width: '80px', height: '80px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto'
        }}>
          <GitCompare size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Compare List is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Add up to 3 parts to compare their parameters side-by-side.</p>
        <Link to="/shop" className="btn btn-primary">Browse Parts</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GitCompare size={32} style={{ color: 'var(--accent)' }} /> Compare Auto Parts ({compareItems.length})
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={clearCompare} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Clear All</button>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}><ArrowLeft size={16} /> Shop More</Link>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '200px' }}>Specification Parameter</th>
              {compareItems.map(item => (
                <th key={item._id} style={{ width: '250px', position: 'relative' }}>
                  <button 
                    onClick={() => toggleCompare(item)}
                    style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'transparent', color: '#e74c3c', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <img src={item.images[0]} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', display: 'block', margin: '10px auto' }} />
                  <Link to={`/products/${item.slug}`}>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'normal', height: '40px', overflow: 'hidden' }}>{item.title}</div>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Price Amount</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: '1.1rem' }}>
                  Rs. {item.price.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Condition</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>
                  <span className="badge badge-accent">{item.condition}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Part Number</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center', fontWeight: 600 }}>{item.partNumber}</td>
              ))}
            </tr>
            <tr>
              <td><strong>OEM Number</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>{item.oemNumber || 'N/A'}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Manufacturer Brand</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>{item.brand ? item.brand.name : 'Genuine'}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Origin Country</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>{item.originCountry}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Warranty Duration</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>{item.warranty}</td>
              ))}
            </tr>
            <tr>
              <td><strong>In Stock Status</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>
                  <span className={`badge ${item.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {item.stock > 0 ? `Yes (${item.stock})` : 'No'}
                  </span>
                </td>
              ))}
            </tr>
            {/* Action Row */}
            <tr>
              <td><strong>Add to Order</strong></td>
              {compareItems.map(item => (
                <td key={item._id} style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => addCartItem(item, 1)}
                    disabled={item.stock === 0}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', gap: '6px' }}
                  >
                    <ShoppingCart size={14} /> Buy
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
