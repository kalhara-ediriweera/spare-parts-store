import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Search, ArrowRight } from 'lucide-react';

const VehicleFilter = () => {
  const [filterData, setFilterData] = useState({
    makes: [],
    models: {},
    years: [],
    engines: [],
    transmissions: [],
    fuelTypes: []
  });

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/products/filters');
        const data = await res.json();
        if (data.success) {
          setFilterData({
            makes: data.makes || [],
            models: data.models || {},
            years: data.years || [],
            engines: data.engines || [],
            transmissions: data.transmissions || [],
            fuelTypes: data.fuelTypes || []
          });
        }
      } catch (err) {
        console.error('Error fetching filter values:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel(''); // Reset dependent dropdown
    setSelectedEngine('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (selectedMake) queryParams.push(`make=${encodeURIComponent(selectedMake)}`);
    if (selectedModel) queryParams.push(`model=${encodeURIComponent(selectedModel)}`);
    if (selectedYear) queryParams.push(`year=${encodeURIComponent(selectedYear)}`);
    if (selectedEngine) queryParams.push(`engine=${encodeURIComponent(selectedEngine)}`);
    
    navigate(`/shop?${queryParams.join('&')}`);
  };

  const modelsList = selectedMake ? filterData.models[selectedMake] || [] : [];

  return (
    <div className="glass-panel" style={{
      padding: '30px',
      margin: '20px 0',
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeInUp 0.6s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ color: 'var(--accent)', display: 'flex' }}>
          <Car size={24} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Vehicle Sourcing & Compatibility Lookup
        </h3>
      </div>

      <form onSubmit={handleSearch} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'end'
      }}>
        {/* Make Dropdown */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Vehicle Make</label>
          <select 
            value={selectedMake} 
            onChange={handleMakeChange} 
            className="form-control"
            disabled={loading}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <option value="">Select Make (e.g. Toyota)</option>
            {filterData.makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Model Dropdown */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Model</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)} 
            className="form-control"
            disabled={!selectedMake || loading}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <option value="">Select Model</option>
            {modelsList.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Manufacturing Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)} 
            className="form-control"
            disabled={loading}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <option value="">Select Year</option>
            {filterData.years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Engine Dropdown */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Engine / Part Code</label>
          <select 
            value={selectedEngine} 
            onChange={(e) => setSelectedEngine(e.target.value)} 
            className="form-control"
            disabled={loading}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <option value="">Select Engine (Optional)</option>
            {filterData.engines.map(eng => (
              <option key={eng} value={eng}>{eng}</option>
            ))}
          </select>
        </div>

        {/* CTA Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{
            height: '46px',
            padding: '0 24px',
            width: '100%',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Search size={18} />
          <span>Find Parts</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
};

export default VehicleFilter;
