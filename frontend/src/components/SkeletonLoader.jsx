import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const arr = Array.from({ length: count });

  if (type === 'card') {
    return (
      <>
        {arr.map((_, idx) => (
          <div className="glass-card" key={idx} style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
            <div className="skeleton" style={{ width: '100%', paddingTop: '75%' }} />
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="skeleton" style={{ width: '40%', height: '14px' }} />
              <div className="skeleton" style={{ width: '90%', height: '20px' }} />
              <div className="skeleton" style={{ width: '60%', height: '14px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div className="skeleton" style={{ width: '50%', height: '24px' }} />
                <div className="skeleton" style={{ width: '30%', height: '36px' }} />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {arr.map((_, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '4px' }} />
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ width: '30%', height: '16px' }} />
              <div className="skeleton" style={{ width: '70%', height: '12px' }} />
            </div>
            <div className="skeleton" style={{ width: '80px', height: '24px' }} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
