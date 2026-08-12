import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrdersAPI, updateProfileAPI } from '../services/api';

const STATUS_MAP = {
  PENDING:    { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fef3c7', icon: '🕐' },
  CONFIRMED:  { label: 'Đã xác nhận',  color: '#3b82f6', bg: '#dbeafe', icon: '✅' },
  PICKED_UP:  { label: 'Đã lấy đồ',    color: '#8b5cf6', bg: '#ede9fe', icon: '🚚' },
  WASHING:    { label: 'Đang giặt',    color: '#06b6d4', bg: '#cffafe', icon: '🫧' },
  DELIVERING: { label: 'Đang giao',    color: '#10b981', bg: '#d1fae5', icon: '🛵' },
  COMPLETED:  { label: 'Hoàn thành',   color: '#22c55e', bg: '#dcfce7', icon: '🎉' },
  CANCELLED:  { label: 'Đã huỷ',       color: '#ef4444', bg: '#fee2e2', icon: '❌' },
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PICKED_UP', 'WASHING', 'DELIVERING', 'COMPLETED'];

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, color: '#6b7280', bg: '#f3f4f6', icon: '•' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 12px',
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 600,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.color}30`,
    }}>
      {s.icon} {s.label}
    </span>
  );
};

const OrderCard = ({ booking }) => {
  const [expanded, setExpanded] = useState(false);
  const currentStep = STATUS_STEPS.indexOf(booking.status);

  return (
    <div className="order-card">
      <div className="order-card__header" onClick={() => setExpanded(v => !v)}>
        <div className="order-card__meta">
          <div className="order-card__code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {booking.orderCode}
          </div>
          <span className="order-card__service">{booking.serviceType}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={booking.status} />
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="order-card__summary">
        <span>📅 Lấy hàng: <strong>{booking.pickupDate}</strong></span>
        <span>🕐 Đặt ngày: <strong>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</strong></span>
      </div>

      {expanded && (
        <div className="order-card__body">
          {/* Progress tracker (chỉ hiện khi không bị huỷ) */}
          {booking.status !== 'CANCELLED' && (
            <div className="order-progress">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className={`order-progress__step ${i <= currentStep ? 'active' : ''}`}>
                  <div className="order-progress__dot">
                    {i < currentStep ? '✓' : STATUS_MAP[step]?.icon}
                  </div>
                  <span>{STATUS_MAP[step]?.label}</span>
                  {i < STATUS_STEPS.length - 1 && <div className="order-progress__line" />}
                </div>
              ))}
            </div>
          )}

          <div className="order-detail-grid">
            <div className="order-detail-item">
              <span className="order-detail-label">Họ tên</span>
              <span className="order-detail-value">{booking.firstName} {booking.lastName}</span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Email</span>
              <span className="order-detail-value">{booking.email}</span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">SĐT</span>
              <span className="order-detail-value">{booking.phone}</span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Địa chỉ</span>
              <span className="order-detail-value">{booking.address}, {booking.suburb}, {booking.state}</span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Thời gian</span>
              <span className="order-detail-value">{booking.pickupTime}</span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Tần suất</span>
              <span className="order-detail-value">{booking.frequency}</span>
            </div>
            {booking.notes && (
              <div className="order-detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="order-detail-label">Ghi chú</span>
                <span className="order-detail-value">{booking.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderHistoryPage = () => {
  const { user, logout, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Profile edit state
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 8 };
      if (statusFilter) params.status = statusFilter;
      const data = await getMyOrdersAPI(params);
      setOrders(data.data || []);
      setPagination({ total: data.total || 0, totalPages: data.totalPages || 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await updateProfileAPI(profileForm);
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <main className="my-orders-page">
      <div className="my-orders-container">

        {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="my-orders-sidebar">
          <div className="sidebar-profile-card">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="sidebar-name">{user?.name}</p>
              <p className="sidebar-email">{user?.email}</p>
              <span className="sidebar-role-badge">{user?.role}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              Lịch sử đơn hàng
            </button>
            <button
              className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Hồ sơ cá nhân
            </button>
            <Link to="/booking" className="sidebar-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Đặt dịch vụ mới
            </Link>
            <button className="sidebar-nav-item sidebar-nav-item--danger" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* ─── Main Content ─────────────────────────────────────────────────── */}
        <div className="my-orders-main">

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="my-orders-header">
                <div>
                  <h1 className="my-orders-title">Lịch sử đơn giặt</h1>
                  <p className="my-orders-subtitle">Theo dõi trạng thái và lịch sử toàn bộ đơn hàng của bạn</p>
                </div>
                <div className="orders-filter">
                  <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="orders-select"
                    aria-label="Lọc theo trạng thái"
                  >
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <button className="orders-refresh-btn" onClick={fetchOrders} title="Làm mới">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </button>
                </div>
              </div>

              {loading && (
                <div className="orders-loading">
                  {[1, 2, 3].map(i => <div key={i} className="order-card-skeleton" />)}
                </div>
              )}

              {!loading && error && (
                <div className="orders-empty">
                  <div style={{ fontSize: 48 }}>⚠️</div>
                  <p style={{ color: '#ef4444' }}>{error}</p>
                  <button className="btn btn-primary" onClick={fetchOrders} style={{ marginTop: 12 }}>Thử lại</button>
                </div>
              )}

              {!loading && !error && orders.length === 0 && (
                <div className="orders-empty">
                  <div style={{ fontSize: 64 }}>🧺</div>
                  <h3>Chưa có đơn hàng nào</h3>
                  <p>Đặt dịch vụ giặt sấy đầu tiên của bạn ngay hôm nay!</p>
                  <Link to="/booking" className="btn btn-primary" style={{ marginTop: 16 }}>
                    Đặt dịch vụ ngay
                  </Link>
                </div>
              )}

              {!loading && !error && orders.length > 0 && (
                <>
                  <div className="orders-stats">
                    <div className="orders-stat">
                      <span className="orders-stat-value">{pagination.total}</span>
                      <span className="orders-stat-label">Tổng đơn</span>
                    </div>
                    <div className="orders-stat">
                      <span className="orders-stat-value">
                        {orders.filter(o => o.status === 'COMPLETED').length}
                      </span>
                      <span className="orders-stat-label">Hoàn thành</span>
                    </div>
                    <div className="orders-stat">
                      <span className="orders-stat-value">
                        {orders.filter(o => ['PENDING', 'CONFIRMED', 'PICKED_UP', 'WASHING', 'DELIVERING'].includes(o.status)).length}
                      </span>
                      <span className="orders-stat-label">Đang xử lý</span>
                    </div>
                  </div>

                  <div className="orders-list">
                    {orders.map(booking => (
                      <OrderCard key={booking._id} booking={booking} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="orders-pagination">
                      <button
                        className="pagination-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                      >← Trước</button>
                      <span className="pagination-info">
                        Trang {page} / {pagination.totalPages}
                      </span>
                      <button
                        className="pagination-btn"
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(p => p + 1)}
                      >Tiếp →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="my-orders-header">
                <div>
                  <h1 className="my-orders-title">Hồ sơ cá nhân</h1>
                  <p className="my-orders-subtitle">Quản lý thông tin tài khoản của bạn</p>
                </div>
              </div>

              <form className="profile-form" onSubmit={handleProfileSave}>
                {profileMsg.text && (
                  <div className={`auth-alert auth-alert--${profileMsg.type}`} role="alert">
                    {profileMsg.text}
                  </div>
                )}

                <div className="profile-form-grid">
                  <div className="auth-field">
                    <label htmlFor="profile-name" className="auth-label">Họ và tên</label>
                    <div className="auth-input-wrapper">
                      <input
                        id="profile-name"
                        type="text"
                        className="auth-input"
                        value={profileForm.name}
                        onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>
                  <div className="auth-field">
                    <label htmlFor="profile-phone" className="auth-label">Số điện thoại</label>
                    <div className="auth-input-wrapper">
                      <input
                        id="profile-phone"
                        type="tel"
                        className="auth-input"
                        value={profileForm.phone}
                        onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="0901234567"
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <div className="auth-input-wrapper">
                    <input
                      type="email"
                      className="auth-input"
                      value={user?.email || ''}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>
                  <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Email không thể thay đổi</p>
                </div>

                <div className="auth-field">
                  <label className="auth-label">Vai trò</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`auth-role-badge auth-role-badge--${user?.role?.toLowerCase()}`}>
                      {user?.role}
                    </span>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>
                      {user?.role === 'CUSTOMER' ? 'Khách hàng' : user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-btn-submit"
                  disabled={profileLoading}
                  style={{ maxWidth: 280 }}
                >
                  {profileLoading ? <><span className="auth-spinner" /> Đang lưu...</> : 'Lưu thay đổi'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderHistoryPage;
