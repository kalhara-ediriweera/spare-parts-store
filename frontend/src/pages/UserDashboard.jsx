import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  MapPin, 
  Car, 
  History, 
  LifeBuoy, 
  Package,
  Award,
  Trash2,
  Calendar,
  CheckCircle,
  FileDown,
  ChevronRight,
  Send,
  Loader
} from 'lucide-react';

const UserDashboard = () => {
  const { 
    user, 
    updateProfile, 
    addAddress, 
    deleteAddress, 
    addVehicle, 
    deleteVehicle 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Address form
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Colombo');
  const [addrPostalCode, setAddrPostalCode] = useState('');

  // Vehicle form
  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehYear, setVehYear] = useState('');
  const [vehEngine, setVehEngine] = useState('');

  // Orders list state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sourcing Custom Requests state
  const [sourcingRequests, setSourcingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Support Tickets state
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketReply, setTicketReply] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone);
    }
  }, [user]);

  // Load orders
  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/orders/myorders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load Custom Sourcing Requests
  const loadRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await fetch('/api/requests/myrequests');
      const data = await res.json();
      if (data.success) setSourcingRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Load Support Tickets
  const loadTickets = async () => {
    try {
      setTicketsLoading(true);
      const res = await fetch('/api/support/mytickets');
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'sourcing') loadRequests();
    if (activeTab === 'support') loadTickets();
  }, [activeTab]);

  // Profile update submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileLoading(true);

    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('phone', profilePhone);
    if (profilePassword) formData.append('password', profilePassword);
    if (profileImageFile) formData.append('profileImage', profileImageFile);

    const res = await updateProfile(formData);
    setProfileLoading(false);
    if (res.success) {
      setProfileSuccess(true);
      setProfilePassword('');
      setProfileImageFile(null);
    }
  };

  // Address add submit
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const res = await addAddress({
      label: addrLabel,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      postalCode: addrPostalCode,
      country: 'Sri Lanka'
    });
    if (res.success) {
      setAddrStreet('');
      setAddrCity('');
      setAddrPostalCode('');
    }
  };

  // Vehicle add submit
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    const res = await addVehicle({
      make: vehMake,
      model: vehModel,
      year: Number(vehYear),
      engine: vehEngine
    });
    if (res.success) {
      setVehMake('');
      setVehModel('');
      setVehYear('');
      setVehEngine('');
    }
  };

  // Ticket create submit
  const handleTicketCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: ticketSubject, message: ticketMessage, priority: ticketPriority })
      });
      const data = await res.json();
      if (data.success) {
        setTicketSubject('');
        setTicketMessage('');
        loadTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ticket reply submit
  const handleTicketReply = async (e) => {
    e.preventDefault();
    if (!ticketReply.trim()) return;

    try {
      const res = await fetch(`/api/support/${selectedTicket._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: ticketReply })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
        setTicketReply('');
        loadTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order status helper classes
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-accent';
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      
      {/* Welcome metadata block */}
      <div className="glass-panel user-profile-header">
        {user?.profileImage ? (
          <img src={user.profileImage} alt="avatar" className="user-avatar" />
        ) : (
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--accent)', color: '#FFFFFF', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800
          }}>
            {user?.name[0]}
          </div>
        )}
        
        <div className="user-info-meta">
          <h2 className="user-name">{user?.name}</h2>
          <p className="user-email">{user?.email}</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={16} style={{ color: 'var(--accent)' }} /> 
              <strong>{user?.rewardPoints || 0} Reward Points</strong>
            </span>
            <span>•</span>
            <span>Referral: <strong>{user?.referralCode || 'N/A'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="dashboard-grid">
        
        {/* Left Side Navigation Menu */}
        <aside className="dashboard-sidebar">
          <button onClick={() => { setActiveTab('profile'); setSelectedOrder(null); setSelectedTicket(null); }} className={`dashboard-menu-link ${activeTab === 'profile' ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <User size={18} /> <span>Account Profile</span>
          </button>
          <button onClick={() => { setActiveTab('orders'); setSelectedOrder(null); setSelectedTicket(null); }} className={`dashboard-menu-link ${activeTab === 'orders' ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <History size={18} /> <span>Order History</span>
          </button>
          <button onClick={() => { setActiveTab('vehicles'); setSelectedOrder(null); setSelectedTicket(null); }} className={`dashboard-menu-link ${activeTab === 'vehicles' ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <Car size={18} /> <span>Saved Vehicles</span>
          </button>
          <button onClick={() => { setActiveTab('addresses'); setSelectedOrder(null); setSelectedTicket(null); }} className={`dashboard-menu-link ${activeTab === 'addresses' ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <MapPin size={18} /> <span>Address Book</span>
          </button>
          <button onClick={() => { setActiveTab('sourcing'); setSelectedOrder(null); setSelectedTicket(null); }} className={`dashboard-menu-link ${activeTab === 'sourcing' ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <Package size={18} /> <span>Sourcing Inquiries</span>
          </button>
          <button onClick={() => { setActiveTab('support'); setSelectedOrder(null); setSelectedTicket(null); }} className={`dashboard-menu-link ${activeTab === 'support' ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <LifeBuoy size={18} /> <span>Help Tickets</span>
          </button>
        </aside>

        {/* Right Side Screens */}
        <main className="dashboard-content">

          {/* Profile settings tab */}
          {activeTab === 'profile' && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Account Settings</h3>
              
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {profileSuccess && <div className="badge badge-success" style={{ padding: '8px 12px' }}>Profile updated successfully!</div>}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} required className="form-control" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">New Password (leave empty to keep current)</label>
                    <input type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Upload Profile Picture</label>
                    <input type="file" onChange={(e) => setProfileImageFile(e.target.files[0])} className="form-control" style={{ padding: '8px' }} />
                  </div>
                </div>

                <button type="submit" disabled={profileLoading} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '0.9rem', marginTop: '10px' }}>
                  {profileLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}

          {/* Order history tab */}
          {activeTab === 'orders' && !selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Purchase History</h3>
              
              {ordersLoading ? (
                <div>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No orders placed yet.
                </div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="glass-card order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">ORD-{order._id.toString().substring(18).toUpperCase()}</span>
                        <div className="order-date"><Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} /> {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                        <span className="badge badge-success">{order.isPaid ? 'Paid' : 'COD Pending'}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        Total Amount: <strong style={{ color: 'var(--accent)' }}>Rs. {order.totalPrice.toLocaleString()}</strong> ({order.orderItems.length} parts)
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedOrder(order)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Track Order</button>
                        <a href={`/api/orders/${order._id}/invoice`} download className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'inline-flex' }}>
                          <FileDown size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tracking detail subscreen */}
          {activeTab === 'orders' && selectedOrder && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Back to List</button>
                <h4>Order Detail Tracking</h4>
              </div>

              {/* Delivery Address block */}
              <div style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                <div>Delivery Location: <strong>{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city} ({selectedOrder.shippingAddress.state})</strong></div>
                <div style={{ marginTop: '4px' }}>Invoice Value: <strong>Rs. {selectedOrder.totalPrice.toLocaleString()}</strong> via {selectedOrder.paymentMethod}</div>
              </div>

              {/* Order Tracking Timeline widget */}
              <div className="timeline">
                <div className="timeline-line" />
                <div className="timeline-line-active" style={{
                  width: selectedOrder.status === 'Pending' ? '0%' : selectedOrder.status === 'Confirmed' ? '25%' : selectedOrder.status === 'Packed' ? '50%' : selectedOrder.status === 'Shipped' ? '75%' : '100%'
                }} />
                
                {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((st, idx) => {
                  const timelineStatuses = selectedOrder.statusTimeline.map(x => x.status);
                  const isCompleted = timelineStatuses.includes(st);
                  const isActive = selectedOrder.status === st;

                  return (
                    <div key={idx} className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted && !isActive ? 'completed' : ''}`}>
                      <div className="timeline-circle">{isCompleted ? <CheckCircle size={16} /> : idx + 1}</div>
                      <span className="timeline-label">{st}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status updates lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
                <h5 style={{ fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Status Log</h5>
                {selectedOrder.statusTimeline.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div>
                      <strong style={{ color: 'var(--accent)' }}>{ev.status}</strong>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>{ev.note}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(ev.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Saved vehicles manager tab */}
          {activeTab === 'vehicles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Saved list */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>My Garage / Saved Vehicles</h3>
                
                {user?.savedVehicles?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No vehicles saved in your garage. Add one to find parts faster.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {user?.savedVehicles?.map(veh => (
                      <div key={veh._id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{veh.make} {veh.model}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Year: {veh.year} | Engine: {veh.engine || 'N/A'}
                          </div>
                        </div>
                        <button onClick={() => deleteVehicle(veh._id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add form */}
              <form onSubmit={handleVehicleSubmit} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Add New Vehicle</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Vehicle Make</label>
                    <input type="text" placeholder="e.g. Toyota" value={vehMake} onChange={(e) => setVehMake(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Model</label>
                    <input type="text" placeholder="e.g. Aqua" value={vehModel} onChange={(e) => setVehModel(e.target.value)} required className="form-control" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Manufacture Year</label>
                    <input type="number" placeholder="e.g. 2015" value={vehYear} onChange={(e) => setVehYear(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Engine / Chassis Code</label>
                    <input type="text" placeholder="e.g. 1NZ-FXE" value={vehEngine} onChange={(e) => setVehEngine(e.target.value)} className="form-control" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '0.85rem' }}>Save to Garage</button>
              </form>

            </div>
          )}

          {/* Address book manager tab */}
          {activeTab === 'addresses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Addresses list */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Delivery Address Book</h3>
                
                {user?.addressBook?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No delivery addresses saved yet.</p>
                ) : (
                  <div className="address-grid">
                    {user?.addressBook?.map(addr => (
                      <div key={addr._id} className="glass-card address-card">
                        <div className="address-header">
                          <span className="address-label">{addr.label} {addr.isDefault && <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '2px 6px', textTransform: 'none' }}>Default</span>}</span>
                          <button onClick={() => deleteAddress(addr._id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          <div>{addr.street}</div>
                          <div>{addr.city}, {addr.state}</div>
                          <div>{addr.postalCode}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddressSubmit} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Add New Address</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Address Label</label>
                    <select value={addrLabel} onChange={(e) => setAddrLabel(e.target.value)} className="form-control" style={{ cursor: 'pointer' }}>
                      <option value="Home">Home</option>
                      <option value="Office">Office / Work</option>
                      <option value="Garage">Garage shop</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Street Address</label>
                    <input type="text" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} required className="form-control" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="product-details-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">City</label>
                    <input type="text" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required className="form-control" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">District State</label>
                    <select value={addrState} onChange={(e) => setAddrState(e.target.value)} className="form-control" required style={{ cursor: 'pointer' }}>
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Other">Other Outstations</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0, maxWidth: '50%' }}>
                  <label className="form-label">Postal Code</label>
                  <input type="text" value={addrPostalCode} onChange={(e) => setAddrPostalCode(e.target.value)} required className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '0.85rem' }}>Save Address</button>
              </form>

            </div>
          )}

          {/* Sourcing requests tab */}
          {activeTab === 'sourcing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Chassis-based Sourcing Requests</h3>
              
              {requestsLoading ? (
                <div>Loading sourcing inquiries...</div>
              ) : sourcingRequests.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No custom part requests submitted yet.
                </div>
              ) : (
                sourcingRequests.map(req => (
                  <div key={req._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{req.partName}</strong>
                      <span className={`badge ${req.status === 'Quoted' ? 'badge-success' : req.status === 'Pending' ? 'badge-warning' : 'badge-accent'}`}>
                        {req.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div>Vehicle: <strong>{req.vehicleMake} {req.vehicleModel} ({req.vehicleYear})</strong> | Chassis Number: <strong>{req.chassisNumber}</strong></div>
                      {req.partDescription && <div style={{ marginTop: '6px', fontStyle: 'italic' }}>Description: "{req.partDescription}"</div>}
                    </div>

                    {/* Admin Quote Reply block */}
                    {req.status === 'Quoted' && (
                      <div style={{
                        background: 'var(--accent-light)',
                        border: '1px solid var(--accent)',
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '10px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          <span>Pricing Quote:</span>
                          <span style={{ color: 'var(--accent)' }}>Rs. {req.quotePrice.toLocaleString()}</span>
                        </div>
                        {req.replyMessage && <div style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--text-secondary)' }}>Note: "{req.replyMessage}"</div>}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Support Tickets tab */}
          {activeTab === 'support' && !selectedTicket && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="product-details-grid">
              
              {/* Tickets list */}
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: '16px' }}>My Tickets</h4>
                {ticketsLoading ? (
                  <div>Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No support tickets opened.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tickets.map(t => (
                      <button 
                        key={t._id} 
                        onClick={() => setSelectedTicket(t)}
                        style={{
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)',
                          display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', width: '100%', textAlign: 'left'
                        }}
                      >
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{t.subject}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: {new Date(t.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`badge ${t.status === 'Closed' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Create ticket form */}
              <form onSubmit={handleTicketCreate} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontWeight: 700 }}>Open Support Ticket</h4>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Subject</label>
                  <input type="text" placeholder="e.g. Delivery status delay" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} required className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Priority</label>
                  <select value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value)} className="form-control" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Message</label>
                  <textarea rows="3" placeholder="Describe the issue..." value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} required className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>Create Ticket</button>
              </form>

            </div>
          )}

          {/* Ticket Messages chat view */}
          {activeTab === 'support' && selectedTicket && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setSelectedTicket(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Back to Tickets</button>
                <h4 style={{ fontWeight: 800 }}>Subject: {selectedTicket.subject}</h4>
              </div>

              {/* Chat messages thread */}
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                height: '280px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {selectedTicket.messages.map((msg, idx) => {
                  const isStaff = msg.senderRole !== 'Customer';
                  return (
                    <div 
                      key={idx}
                      style={{
                        alignSelf: isStaff ? 'flex-start' : 'flex-end',
                        maxWidth: '75%',
                        background: isStaff ? 'var(--bg-secondary)' : 'var(--accent-light)',
                        border: isStaff ? '1px solid var(--border)' : '1px solid var(--accent)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isStaff ? 'var(--accent)' : 'var(--text-primary)', marginBottom: '4px' }}>
                        {msg.senderName} ({msg.senderRole})
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              {selectedTicket.status !== 'Closed' ? (
                <form onSubmit={handleTicketReply} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Type your reply here..." 
                    className="form-control"
                    value={ticketReply}
                    onChange={(e) => setTicketReply(e.target.value)}
                    style={{ flexGrow: 1, fontSize: '0.9rem' }}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div className="badge badge-success" style={{ padding: '10px', justifyContent: 'center' }}>This support ticket is closed.</div>
              )}

            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default UserDashboard;
