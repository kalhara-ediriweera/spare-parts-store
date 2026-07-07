import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, Gift } from 'lucide-react';

const Register = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(name, email, password, phone, referralCode);
    setLoading(false);
    if (res.success) {
      navigate(redirect);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'var(--accent-light)', color: 'var(--accent)',
            width: '56px', height: '56px', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'
          }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create SpareX Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Register to unlock reward points on parts purchases</p>
        </div>

        {error && <div className="badge badge-danger" style={{ padding: '10px', width: '100%', justifyContent: 'center', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name</label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="form-control"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="email" 
                placeholder="you@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="form-control"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number</label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="tel" 
                placeholder="07xxxxxxxx" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
                className="form-control"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="password" 
                placeholder="minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="form-control"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Referral Code (Optional)</label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="e.g., SPAREX-CODE" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '40px' }}
              />
              <Gift size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', height: '46px', marginTop: '10px' }}
          >
            {loading ? 'Creating Account...' : 'Register New Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
