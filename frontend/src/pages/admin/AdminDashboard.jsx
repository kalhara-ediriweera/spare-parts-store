import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  LayoutDashboard, 
  Box, 
  Users, 
  ShoppingBag, 
  PackageSearch, 
  MessageSquare, 
  Settings, 
  Plus, 
  Trash2, 
  Upload, 
  FileSpreadsheet, 
  ShieldAlert,
  Edit,
  DollarSign,
  UserCheck,
  Send,
  Loader
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check auth
  useEffect(() => {
    if (!user || !['Super Admin', 'Admin', 'Manager', 'Inventory Staff', 'Customer Support'].includes(user.role)) {
      navigate('/');
    }
  }, [user]);

  const [activeTab, setActiveTab] = useState('analytics');

  // Shared Data States
  const [stats, setStats] = useState({ totalProducts: 0, totalCustomers: 0, totalOrders: 0, totalRevenue: 0 });
  const [dailySales, setDailySales] = useState([]);
  const [categoryShare, setCategoryShare] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Products CRUD State
  const [productList, setProductList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form inputs
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodPartNo, setProdPartNo] = useState('');
  const [prodOemNo, setProdOemNo] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodCondition, setProdCondition] = useState('New');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImagesInput, setProdImagesInput] = useState(''); // comma-separated strings
  const [compatibilityMake, setCompatibilityMake] = useState('');
  const [compatibilityModel, setCompatibilityModel] = useState('');
  const [compatibilityYear, setCompatibilityYear] = useState('');

  // CSV Import state
  const [csvFile, setCsvFile] = useState(null);
  const [csvSuccess, setCsvSuccess] = useState(false);

  // Customers state
  const [customers, setCustomers] = useState([]);

  // Sourcing Inquiries state
  const [sourcingRequests, setSourcingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  // Support Tickets state
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReply, setTicketReply] = useState('');

  // CMS state
  const [sliderJson, setSliderJson] = useState('');
  const [cmsSuccess, setCmsSuccess] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setDailySales(data.dailySales);
        setCategoryShare(data.categoryShare);
        setRecentOrders(data.recentOrders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Fetch list depending on tabs
  useEffect(() => {
    if (activeTab === 'products') {
      const fetchProducts = async () => {
        const [res, catRes, brandRes] = await Promise.all([
          fetch('/api/products?limit=100'),
          fetch('/api/products/categories'),
          fetch('/api/products/brands')
        ]);
        const data = await res.json();
        const cats = await catRes.json();
        const brands = await brandRes.json();
        if (data.success) setProductList(data.products);
        if (cats.success) setCategoriesList(cats.categories);
        if (brands.success) setBrandsList(brands.brands);
      };
      fetchProducts();
    }

    if (activeTab === 'customers') {
      const fetchCustomers = async () => {
        const res = await fetch('/api/admin/customers');
        const data = await res.json();
        if (data.success) setCustomers(data.customers);
      };
      fetchCustomers();
    }

    if (activeTab === 'requests') {
      const fetchRequests = async () => {
        const res = await fetch('/api/requests/admin');
        const data = await res.json();
        if (data.success) setSourcingRequests(data.requests);
      };
      fetchRequests();
    }

    if (activeTab === 'support') {
      const fetchTickets = async () => {
        const res = await fetch('/api/support/admin');
        const data = await res.json();
        if (data.success) setTickets(data.tickets);
      };
      fetchTickets();
    }

    if (activeTab === 'cms') {
      const fetchCms = async () => {
        const res = await fetch('/api/cms/hero_slider');
        const data = await res.json();
        if (data.success) setSliderJson(JSON.stringify(data.value, null, 2));
      };
      fetchCms();
    }
  }, [activeTab]);

  // Product Create/Update submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    // Build compatibility list
    const compatibility = [];
    if (compatibilityMake && compatibilityModel && compatibilityYear) {
      compatibility.push({
        make: compatibilityMake,
        model: compatibilityModel,
        yearStart: Number(compatibilityYear) - 4,
        yearEnd: Number(compatibilityYear) + 4
      });
    }

    const payload = {
      title: prodTitle,
      price: Number(prodPrice),
      stock: Number(prodStock),
      partNumber: prodPartNo,
      oemNumber: prodOemNo,
      sku: prodSku,
      brand: prodBrand || brandsList[0]?._id,
      category: prodCat || categoriesList[0]?._id,
      condition: prodCondition,
      description: prodDesc,
      images: prodImagesInput.split(','),
      compatibility
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowProductModal(false);
        // Refresh product list
        const updated = await fetch('/api/products?limit=100');
        const updatedData = await updated.json();
        if (updatedData.success) setProductList(updatedData.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProductList(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV file upload handler
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const res = await fetch('/api/admin/products/bulk-upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCsvSuccess(true);
        setCsvFile(null);
        // Refresh products list if currently on products tab
        const updated = await fetch('/api/products?limit=100');
        const updatedData = await updated.json();
        if (updatedData.success) setProductList(updatedData.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle customer block status
  const toggleUserStatus = async (id) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}/status`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setCustomers(prev => prev.map(c => c._id === id ? { ...c, status: data.customer.status } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit quote reply for sourcing inquiry
  const handleRequestQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Quoted',
          quotePrice: Number(quotePrice),
          replyMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedRequest(null);
        setQuotePrice('');
        setReplyMessage('');
        // Refresh requests list
        const reqs = await fetch('/api/requests/admin');
        const reqsData = await reqs.json();
        if (reqsData.success) setSourcingRequests(reqsData.requests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reply to support ticket
  const handleSupportReply = async (e) => {
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
        // Refresh list
        const tix = await fetch('/api/support/admin');
        const tixData = await tix.json();
        if (tixData.success) setTickets(tixData.tickets);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeSupportTicket = async (id) => {
    try {
      const res = await fetch(`/api/support/${id}/close`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
        // Refresh list
        const tix = await fetch('/api/support/admin');
        const tixData = await tix.json();
        if (tixData.success) setTickets(tixData.tickets);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save CMS Hero Slider
  const handleCmsSubmit = async (e) => {
    e.preventDefault();
    setCmsSuccess(false);
    try {
      const parsed = JSON.parse(sliderJson);
      const res = await fetch('/api/cms/hero_slider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsed })
      });
      const data = await res.json();
      if (data.success) setCmsSuccess(true);
    } catch (err) {
      alert('Invalid JSON structure! Make sure format is correct.');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdPrice('');
    setProdStock('');
    setProdPartNo('');
    setProdOemNo('');
    setProdSku('');
    setProdBrand(brandsList[0]?._id || '');
    setProdCat(categoriesList[0]?._id || '');
    setProdCondition('New');
    setProdDesc('');
    setProdImagesInput('/uploads/products/default.jpg');
    setCompatibilityMake('Toyota');
    setCompatibilityModel('Prius');
    setCompatibilityYear('2015');
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdPrice(product.price);
    setProdStock(product.stock);
    setProdPartNo(product.partNumber);
    setProdOemNo(product.oemNumber || '');
    setProdSku(product.sku);
    setProdBrand(product.brand?._id || '');
    setProdCat(product.category?._id || '');
    setProdCondition(product.condition);
    setProdDesc(product.description);
    setProdImagesInput(product.images.join(','));
    setCompatibilityMake(product.compatibility[0]?.make || 'Toyota');
    setCompatibilityModel(product.compatibility[0]?.model || 'Prius');
    setCompatibilityYear(product.compatibility[0]?.yearStart ? product.compatibility[0].yearStart + 4 : '2015');
    setShowProductModal(true);
  };

  const COLORS = ['#FF6B00', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];

  return (
    <div className="admin-layout">
      
      {/* Sidebar Nav */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>SPAREX STAFF</span>
        </div>
        <ul className="admin-menu">
          <li className={`admin-menu-item ${activeTab === 'analytics' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('analytics')} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
              <LayoutDashboard size={18} /> <span>Analytics Panel</span>
            </button>
          </li>
          <li className={`admin-menu-item ${activeTab === 'products' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('products')} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
              <Box size={18} /> <span>Products CRUD</span>
            </button>
          </li>
          <li className={`admin-menu-item ${activeTab === 'customers' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('customers')} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
              <Users size={18} /> <span>Customer Control</span>
            </button>
          </li>
          <li className={`admin-menu-item ${activeTab === 'requests' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('requests')} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
              <PackageSearch size={18} /> <span>Sourcing Quotes</span>
            </button>
          </li>
          <li className={`admin-menu-item ${activeTab === 'support' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('support')} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
              <MessageSquare size={18} /> <span>Help Desk Agent</span>
            </button>
          </li>
          <li className={`admin-menu-item ${activeTab === 'cms' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('cms')} style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
              <Settings size={18} /> <span>CMS Homepage</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Body */}
      <main className="admin-content">
        <header className="admin-navbar">
          <h3>Portal: {user?.role} ({user?.name.split(' ')[0]})</h3>
        </header>

        <div className="admin-body">
          
          {/* TAB 1: Analytics charts */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Stats Grid Counters */}
              <div className="admin-stats-grid">
                <div className="glass-panel stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Revenue</span>
                    <strong className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</strong>
                  </div>
                  <div className="stat-icon"><DollarSign size={24} /></div>
                </div>
                <div className="glass-panel stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Completed Orders</span>
                    <strong className="stat-value">{stats.totalOrders}</strong>
                  </div>
                  <div className="stat-icon"><ShoppingBag size={24} /></div>
                </div>
                <div className="glass-panel stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Products</span>
                    <strong className="stat-value">{stats.totalProducts}</strong>
                  </div>
                  <div className="stat-icon"><Box size={24} /></div>
                </div>
                <div className="glass-panel stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Registered Customers</span>
                    <strong className="stat-value">{stats.totalCustomers}</strong>
                  </div>
                  <div className="stat-icon"><Users size={24} /></div>
                </div>
              </div>

              {/* Charts graphs split */}
              <div className="charts-grid">
                
                {/* 7 Days Area Chart */}
                <div className="glass-panel chart-card">
                  <h4 className="chart-title">Sales Revenue Progress (Last 7 Days)</h4>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <AreaChart data={dailySales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="var(--accent)" fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Categories share Pie chart */}
                <div className="glass-panel chart-card">
                  <h4 className="chart-title">Stock Category Distribution</h4>
                  <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="99%">
                      <PieChart>
                        <Pie
                          data={categoryShare}
                          cx="50%"
                          cy="45%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Recent Orders table */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '16px' }}>Recent Store Purchases</h4>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User Account</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Paid</th>
                        <th>Grand Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>ORD-{order._id.toString().substring(18).toUpperCase()}</td>
                          <td>{order.user ? order.user.name : order.guestDetails.name}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td><span className="badge badge-accent">{order.status}</span></td>
                          <td><span className="badge badge-success">{order.isPaid ? 'Paid' : 'Pending'}</span></td>
                          <td style={{ fontWeight: 700 }}>Rs. {order.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Products CRUD operations */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Product Controls header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <button onClick={openAddProductModal} className="btn btn-primary">
                  <Plus size={18} /> Add New Spare Part
                </button>

                {/* CSV download & Upload elements */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <a href="/api/admin/products/export" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '6px' }}>
                    <FileSpreadsheet size={16} /> Export Catalog CSV
                  </a>
                  
                  <form onSubmit={handleCsvUpload} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files[0])}
                      className="form-control"
                      style={{ padding: '6px', fontSize: '0.8rem', maxWidth: '180px' }}
                    />
                    <button type="submit" className="btn btn-secondary" style={{ padding: '8px' }} disabled={!csvFile}>
                      <Upload size={16} />
                    </button>
                  </form>
                </div>
              </div>

              {csvSuccess && <div className="badge badge-success" style={{ padding: '10px', justifyContent: 'center' }}>Products bulk imported successfully!</div>}

              {/* Products Catalog Table list */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title / Part Number</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Brand</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map(prod => (
                        <tr key={prod._id}>
                          <td>
                            <strong>{prod.title}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PN: {prod.partNumber} | OEM: {prod.oemNumber || 'N/A'}</div>
                          </td>
                          <td>{prod.sku}</td>
                          <td>Rs. {prod.price.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${prod.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                              {prod.stock} units
                            </span>
                          </td>
                          <td>{prod.brand?.name}</td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => openEditProductModal(prod)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit size={14} /></button>
                              <button onClick={() => deleteProduct(prod._id)} className="btn btn-secondary" style={{ padding: '6px', color: '#e74c3c' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Customers list */}
          {activeTab === 'customers' && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>User Account Controls</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name / Email</th>
                      <th>Phone</th>
                      <th>System Role</th>
                      <th>Account Status</th>
                      <th>Action Lock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c._id}>
                        <td>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</div>
                        </td>
                        <td>{c.phone || 'N/A'}</td>
                        <td><span className="badge badge-accent">{c.role}</span></td>
                        <td>
                          <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{c.status}</span>
                        </td>
                        <td>
                          {c.role !== 'Super Admin' && (
                            <button 
                              onClick={() => toggleUserStatus(c._id)}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: c.status === 'Active' ? '#e74c3c' : '#2ecc71' }}
                            >
                              {c.status === 'Active' ? 'Block Account' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Sourcing Quotes panel */}
          {activeTab === 'requests' && !selectedRequest && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Chassis Sourcing Requests</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Requester Details</th>
                      <th>Vehicle Info</th>
                      <th>Chassis VIN</th>
                      <th>Component Needed</th>
                      <th>Sourcing Status</th>
                      <th>Quote Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourcingRequests.map(req => (
                      <tr key={req._id}>
                        <td>
                          <strong>{req.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.email} | {req.phone}</div>
                        </td>
                        <td>{req.vehicleMake} {req.vehicleModel} ({req.vehicleYear})</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{req.chassisNumber}</td>
                        <td>{req.partName}</td>
                        <td><span className={`badge ${req.status === 'Quoted' ? 'badge-success' : 'badge-warning'}`}>{req.status}</span></td>
                        <td>
                          <button onClick={() => setSelectedRequest(req)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            {req.status === 'Quoted' ? 'Update Quote' : 'Quote Price'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quote form modal */}
          {activeTab === 'requests' && selectedRequest && (
            <div className="glass-panel" style={{ padding: '24px', maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => setSelectedRequest(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Back to List</button>
                <h4>Quote Custom Sourcing</h4>
              </div>

              <div style={{
                background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '20px'
              }}>
                <div>Requester: <strong>{selectedRequest.name} ({selectedRequest.phone})</strong></div>
                <div>VIN: <strong style={{ color: 'var(--accent)' }}>{selectedRequest.chassisNumber}</strong></div>
                <div>Vehicle: <strong>{selectedRequest.vehicleMake} {selectedRequest.vehicleModel} ({selectedRequest.vehicleYear})</strong></div>
                <div>Part Sourcing Required: <strong>{selectedRequest.partName}</strong></div>
                {selectedRequest.partDescription && <div style={{ marginTop: '6px' }}>Notes: "{selectedRequest.partDescription}"</div>}
              </div>

              <form onSubmit={handleRequestQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Price Quote Amount (LKR)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 14500" 
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    required 
                    className="form-control" 
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Admin Sourcing Message (delivery period, genuine check info)</label>
                  <textarea 
                    rows="3" 
                    placeholder="e.g., We have found a Japan auction genuine shock absorber. Delivery in 14 days." 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="form-control" 
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Issue Sourcing Quote</button>
              </form>
            </div>
          )}

          {/* TAB 5: Support Tickets */}
          {activeTab === 'support' && !selectedTicket && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Active Help Desk Tickets</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sender Account</th>
                      <th>Ticket Subject</th>
                      <th>Priority Level</th>
                      <th>Open Status</th>
                      <th>Agent Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t._id}>
                        <td>
                          <strong>{t.user?.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.user?.email}</div>
                        </td>
                        <td>{t.subject}</td>
                        <td><span className={`badge ${t.priority === 'High' ? 'badge-danger' : 'badge-accent'}`}>{t.priority}</span></td>
                        <td><span className={`badge ${t.status === 'Closed' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
                        <td>
                          <button onClick={() => setSelectedTicket(t)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Open Chat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ticket Messages Agent view */}
          {activeTab === 'support' && selectedTicket && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setSelectedTicket(null)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Back to Tickets</button>
                <h4 style={{ fontWeight: 800 }}>Subject: {selectedTicket.subject}</h4>
                {selectedTicket.status !== 'Closed' && (
                  <button onClick={() => closeSupportTicket(selectedTicket._id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#e74c3c' }}>Close Ticket</button>
                )}
              </div>

              {/* Chat messages thread */}
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                height: '300px',
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
                        alignSelf: isStaff ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        background: isStaff ? 'var(--accent-light)' : 'var(--bg-secondary)',
                        border: isStaff ? '1px solid var(--accent)' : '1px solid var(--border)',
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
              {selectedTicket.status !== 'Closed' && (
                <form onSubmit={handleSupportReply} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Type agent response..." 
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
              )}

            </div>
          )}

          {/* TAB 6: CMS slider configuration */}
          {activeTab === 'cms' && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Homepage Editor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Configure hero banner slider items by entering slider items array JSON.</p>
              
              <form onSubmit={handleCmsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cmsSuccess && <div className="badge badge-success" style={{ padding: '10px', alignSelf: 'flex-start' }}>Homepage slider layout updated!</div>}
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Slider Configuration JSON</label>
                  <textarea 
                    rows="14" 
                    value={sliderJson}
                    onChange={(e) => setSliderJson(e.target.value)}
                    className="form-control"
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem', width: '100%', whiteSpace: 'pre' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Homepage CMS Layout</button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110
        }}>
          <form onSubmit={handleProductSubmit} className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '30px', background: 'var(--bg-secondary)', overflowY: 'auto', maxHeight: '90vh' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>{editingProduct ? 'Edit Catalog Product' : 'Add New catalog Product'}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Part Title</label>
                  <input type="text" value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} required className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">SKU</label>
                  <input type="text" placeholder="e.g. SP-4092" value={prodSku} onChange={(e) => setProdSku(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Price (LKR)</label>
                  <input type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Stock Units</label>
                  <input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Condition</label>
                  <select value={prodCondition} onChange={(e) => setProdCondition(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }}>
                    <option value="New">New</option>
                    <option value="Reconditioned">Reconditioned</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Part Number</label>
                  <input type="text" value={prodPartNo} onChange={(e) => setProdPartNo(e.target.value)} required className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">OEM Number</label>
                  <input type="text" value={prodOemNo} onChange={(e) => setProdOemNo(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Brand</label>
                  <select value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }}>
                    {brandsList.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category</label>
                  <select value={prodCat} onChange={(e) => setProdCat(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }}>
                    {categoriesList.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Compatibility configuration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px dashed var(--border)', padding: '12px', borderRadius: '4px' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Compatibility Map</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="Make e.g. Toyota" value={compatibilityMake} onChange={(e) => setCompatibilityMake(e.target.value)} className="form-control" style={{ fontSize: '0.8rem' }} />
                  <input type="text" placeholder="Model e.g. Prius" value={compatibilityModel} onChange={(e) => setCompatibilityModel(e.target.value)} className="form-control" style={{ fontSize: '0.8rem' }} />
                  <input type="number" placeholder="Year e.g. 2015" value={compatibilityYear} onChange={(e) => setCompatibilityYear(e.target.value)} className="form-control" style={{ fontSize: '0.8rem' }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Images URLs (comma-separated list)</label>
                <input type="text" value={prodImagesInput} onChange={(e) => setProdImagesInput(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Product Description</label>
                <textarea rows="3" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary" style={{ flexGrow: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Save Product</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
