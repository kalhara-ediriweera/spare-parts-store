import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, Camera, Info, HelpCircle } from 'lucide-react';

const RequestPart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [partDescription, setPartDescription] = useState('');
  const [partImageFile, setPartImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!vehicleMake || !vehicleModel || !vehicleYear || !chassisNumber || !partName) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('vehicleMake', vehicleMake);
      formData.append('vehicleModel', vehicleModel);
      formData.append('vehicleYear', vehicleYear);
      formData.append('chassisNumber', chassisNumber);
      formData.append('partName', partName);
      formData.append('partDescription', partDescription);
      if (partImageFile) formData.append('partImage', partImageFile);

      const res = await fetch('/api/requests', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setVehicleMake('');
        setVehicleModel('');
        setVehicleYear('');
        setChassisNumber('');
        setPartName('');
        setPartDescription('');
        setPartImageFile(null);
      } else {
        setError(data.message || 'Sourcing request failed.');
      }
    } catch (err) {
      setError('Failed to submit custom sourcing request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--accent-light)', color: 'var(--accent)',
            width: '56px', height: '56px', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'
          }}>
            <HelpCircle size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Custom Part Sourcing Request</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '6px', maxWidth: '450px', margin: '6px auto 0 auto' }}>
            Cannot find the component you need? Upload your vehicle details and chassis number. We will source it directly from Japan.
          </p>
        </div>

        {success ? (
          <div className="glass-panel animate-fade-in-up" style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}>
            <div className="badge badge-success" style={{ padding: '8px 16px', marginBottom: '16px', fontSize: '0.9rem' }}>Inquiry Submitted Successfully!</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>We are reviewing your request</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
              Our engineering team will look up compatible parts on Japanese catalog systems using your chassis number and issue a price quote shortly.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Track in Dashboard</button>
              ) : (
                <button onClick={() => navigate('/shop')} className="btn btn-primary">Continue Browsing</button>
              )}
              <button onClick={() => setSuccess(false)} className="btn btn-secondary">Request Another Part</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {error && <div className="badge badge-danger" style={{ padding: '10px', justifyContent: 'center' }}>{error}</div>}

            {/* Contact details */}
            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Your Contact Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
                  </div>
                </div>
                <div className="form-group" style={{ margin: 0, maxWidth: '50%' }}>
                  <label className="form-label">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-control" />
                </div>
              </div>
            )}

            {/* Vehicle Sourcing Specifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Vehicle Specifications</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Make (e.g. Toyota, Nissan)</label>
                  <input type="text" placeholder="e.g. Toyota" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Model (e.g. Vitz, Corolla)</label>
                  <input type="text" placeholder="e.g. Vitz" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} required className="form-control" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Manufacturing Year</label>
                  <input type="number" placeholder="e.g. 2016" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Chassis / VIN Number <span title="Usually starts with characters like KSP130, NHP10, GP5, etc. Found on dashboard corner or seat frame." style={{ cursor: 'help', color: 'var(--accent)' }}><Info size={14} /></span>
                  </label>
                  <input type="text" placeholder="e.g. KSP130-203492" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required className="form-control" />
                </div>
              </div>
            </div>

            {/* Part specifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Part Details</h4>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Part Name / Component Needed</label>
                <input type="text" placeholder="e.g. Left Front Shock Absorber Mounting" value={partName} onChange={(e) => setPartName(e.target.value)} required className="form-control" />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Part Details (describe condition, specific part numbers if any)</label>
                <textarea rows="3" placeholder="Describe the part you need as clearly as possible..." value={partDescription} onChange={(e) => setPartDescription(e.target.value)} className="form-control" />
              </div>

              {/* Photo Upload */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Upload Reference Photo / Chassis Plate Image (Optional)</label>
                <div style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: 'var(--bg-secondary)'
                }}>
                  <input 
                    type="file" 
                    onChange={(e) => setPartImageFile(e.target.files[0])}
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      opacity: 0, cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Camera size={24} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.85rem' }}>{partImageFile ? `Selected: ${partImageFile.name}` : 'Click or Drag photo here to upload'}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>JPG, PNG, WEBP up to 5MB</span>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '46px', display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
              <Send size={18} />
              <span>{loading ? 'Submitting request...' : 'Send Sourcing Request'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default RequestPart;
