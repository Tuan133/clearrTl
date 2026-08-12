import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminDashboardAPI,
  getAllBookingsAdminAPI,
  updateBookingStatusAPI,
  getAllContactsAdminAPI,
  resolveContactAPI,
  unresolveContactAPI,
  getAllGiftCardsAdminAPI,
  getAllUsersAdminAPI,
  toggleUserActiveAPI
} from '../services/api';

// ─── SVG ICON SYSTEM (Professional Vector Icons) ──────────────────────────────
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

const IconOrders = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconContacts = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconGiftCard = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const IconUsers = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const IconRevenue = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const IconBox = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconGiftBig = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const IconMessageAlert = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="14" x2="12.01" y2="14"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconTruck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const IconWashing = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <circle cx="12" cy="13" r="4.5"/>
    <path d="M12 10.5a2.5 2.5 0 0 1 2.5 2.5"/>
  </svg>
);

const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconUnlock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

const STATUS_MAP = {
  PENDING: { label: 'Chờ Xử Lý', bg: '#fef3c7', color: '#92400e', icon: <IconClock /> },
  CONFIRMED: { label: 'Đã Xác Nhận', bg: '#e0e7ff', color: '#3730a3', icon: <IconCheck /> },
  PICKED_UP: { label: 'Đã Lấy Đồ', bg: '#dbeafe', color: '#1e40af', icon: <IconOrders /> },
  WASHING: { label: 'Đang Giặt', bg: '#e0f2fe', color: '#0369a1', icon: <IconWashing /> },
  DELIVERING: { label: 'Đang Giao', bg: '#f3e8ff', color: '#6b21a8', icon: <IconTruck /> },
  COMPLETED: { label: 'Hoàn Thành', bg: '#dcfce7', color: '#166534', icon: <IconCheck /> },
  CANCELLED: { label: 'Đã Hủy', bg: '#fee2e2', color: '#991b1b', icon: <IconX /> }
};

const NEXT_STATUS = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PICKED_UP',
  PICKED_UP: 'WASHING',
  WASHING: 'DELIVERING',
  DELIVERING: 'COMPLETED'
};

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(null);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('');
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [contactFilterStatus, setContactFilterStatus] = useState('');
  const [contactPage, setContactPage] = useState(1);
  const [contactTotalPages, setContactTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);

  // Gift Cards State
  const [giftCards, setGiftCards] = useState([]);

  // Users State
  const [users, setUsers] = useState([]);

  const showToastMsg = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // 1. Fetch Dashboard Data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboardAPI();
      if (res.success) setDashboardData(res.data);
    } catch (err) {
      showToastMsg('Lỗi tải dashboard: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: bookingPage, limit: 10 };
      if (bookingFilterStatus) params.status = bookingFilterStatus;
      const res = await getAllBookingsAdminAPI(params);
      if (res.success) {
        setBookings(res.data);
        setBookingTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      showToastMsg('Lỗi tải đơn hàng: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [bookingPage, bookingFilterStatus]);

  // 3. Fetch Contacts
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: contactPage, limit: 10 };
      if (contactFilterStatus) params.status = contactFilterStatus;
      const res = await getAllContactsAdminAPI(params);
      if (res.success) {
        setContacts(res.data);
        setContactTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      showToastMsg('Lỗi tải phản hồi liên hệ: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [contactPage, contactFilterStatus]);

  // 4. Fetch Gift Cards
  const fetchGiftCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllGiftCardsAdminAPI();
      if (res.success) setGiftCards(res.data);
    } catch (err) {
      showToastMsg('Lỗi tải thẻ quà tặng: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAdminAPI();
      if (res.success) setUsers(res.data);
    } catch (err) {
      showToastMsg('Lỗi tải danh sách người dùng: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboard();
    if (activeTab === 'orders') fetchBookings();
    if (activeTab === 'contacts') fetchContacts();
    if (activeTab === 'giftcards') fetchGiftCards();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchDashboard, fetchBookings, fetchContacts, fetchGiftCards, fetchUsers]);

  // Handlers for Order Status Update
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await updateBookingStatusAPI(bookingId, newStatus);
      if (res.success) {
        showToastMsg(`Đã chuyển đơn hàng sang [${STATUS_MAP[newStatus]?.label}]`, 'success');
        fetchBookings();
        if (activeTab === 'dashboard') fetchDashboard();
      }
    } catch (err) {
      showToastMsg('Không thể cập nhật trạng thái: ' + err.message, 'error');
    }
  };

  // Handlers for Contact Resolve
  const handleToggleContactResolve = async (contact) => {
    try {
      const isResolved = contact.status === 'PROCESSED';
      const res = isResolved
        ? await unresolveContactAPI(contact._id)
        : await resolveContactAPI(contact._id);

      if (res.success) {
        showToastMsg(isResolved ? 'Đã đánh dấu là CHƯA xử lý' : 'Đã đánh dấu ĐÃ XỬ LÝ!', 'success');
        fetchContacts();
        if (activeTab === 'dashboard') fetchDashboard();
      }
    } catch (err) {
      showToastMsg('Lỗi xử lý: ' + err.message, 'error');
    }
  };

  // Handler for User Active Toggle
  const handleToggleUserActive = async (userId) => {
    try {
      const res = await toggleUserActiveAPI(userId);
      if (res.success) {
        showToastMsg(res.message, 'success');
        fetchUsers();
      }
    } catch (err) {
      showToastMsg('Lỗi đổi trạng thái tài khoản: ' + err.message, 'error');
    }
  };

  return (
    <div className="admin-portal">
      {/* Toast Alert */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          <span className="admin-toast-icon">
            {toast.type === 'error' ? <IconX /> : <IconCheck />}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-badge-icon">
            <IconShield />
          </div>
          <div>
            <h3>TLaundry Admin</h3>
            <span className="admin-user-role">{user?.name} ({user?.role})</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon"><IconDashboard /></span>
            <span>Dashboard & Thống Kê</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon"><IconOrders /></span>
            <span>Quản Lý Đơn Hàng</span>
            {dashboardData?.orders?.pending > 0 && (
              <span className="nav-badge alert">{dashboardData.orders.pending}</span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <span className="nav-icon"><IconContacts /></span>
            <span>Quản Lý Liên Hệ</span>
            {dashboardData?.contacts?.pending > 0 && (
              <span className="nav-badge info">{dashboardData.contacts.pending}</span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'giftcards' ? 'active' : ''}`}
            onClick={() => setActiveTab('giftcards')}
          >
            <span className="nav-icon"><IconGiftCard /></span>
            <span>Thẻ Quà Tặng</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon"><IconUsers /></span>
            <span>Quản Lý Tài Khoản</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="admin-back-btn">← Về trang chủ TLaundry</a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h2>
              {activeTab === 'dashboard' && 'Dashboard & Thống Kê Hệ Thống'}
              {activeTab === 'orders' && 'Quản Lý Đơn Giặt Ủi'}
              {activeTab === 'contacts' && 'Quản Lý Khách Hàng & Phản Hồi'}
              {activeTab === 'giftcards' && 'Danh Sách Thẻ Quà Tặng Đã Bán'}
              {activeTab === 'users' && 'Danh Sách Tài Khoản Người Dùng'}
            </h2>
            <p>Trang quản trị vận hành TLaundry Realtime Portal</p>
          </div>

          <div className="admin-topbar-actions">
            <button className="admin-refresh-btn" onClick={() => {
              if (activeTab === 'dashboard') fetchDashboard();
              if (activeTab === 'orders') fetchBookings();
              if (activeTab === 'contacts') fetchContacts();
              if (activeTab === 'giftcards') fetchGiftCards();
              if (activeTab === 'users') fetchUsers();
            }}>
              <IconRefresh />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>
        </header>

        {loading && <div className="admin-loading-bar" />}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="admin-content-section">
            {/* KPI Cards Grid */}
            <div className="kpi-grid">
              <div className="kpi-card primary">
                <div className="kpi-icon"><IconBox /></div>
                <div className="kpi-info">
                  <span className="kpi-label">Đơn Hàng Hôm Nay</span>
                  <h3 className="kpi-value">{dashboardData?.orders?.today ?? 0}</h3>
                  <span className="kpi-sub">Tháng này: {dashboardData?.orders?.thisMonth ?? 0} đơn</span>
                </div>
              </div>

              <div className="kpi-card success">
                <div className="kpi-icon"><IconRevenue /></div>
                <div className="kpi-info">
                  <span className="kpi-label">Doanh Thu Hôm Nay</span>
                  <h3 className="kpi-value">
                    {(dashboardData?.revenue?.today ?? 0).toLocaleString()}đ
                  </h3>
                  <span className="kpi-sub">Tổng: {(dashboardData?.revenue?.total ?? 0).toLocaleString()}đ</span>
                </div>
              </div>

              <div className="kpi-card warning">
                <div className="kpi-icon"><IconGiftBig /></div>
                <div className="kpi-info">
                  <span className="kpi-label">Thẻ Quà Tặng Đã Bán</span>
                  <h3 className="kpi-value">{dashboardData?.giftCards?.totalSold ?? 0}</h3>
                  <span className="kpi-sub">Hôm nay: {dashboardData?.giftCards?.soldToday ?? 0} thẻ</span>
                </div>
              </div>

              <div className="kpi-card danger">
                <div className="kpi-icon"><IconMessageAlert /></div>
                <div className="kpi-info">
                  <span className="kpi-label">Liên Hệ Chưa Xử Lý</span>
                  <h3 className="kpi-value">{dashboardData?.contacts?.pending ?? 0}</h3>
                  <span className="kpi-sub">Đã xử lý: {dashboardData?.contacts?.processed ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Breakdown */}
            <div className="admin-dashboard-two-col">
              {/* Recent Orders Box */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Đơn Giặt Mới Nhất</h3>
                  <button className="admin-text-btn" onClick={() => setActiveTab('orders')}>Xem tất cả →</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Đơn</th>
                        <th>Khách Hàng</th>
                        <th>Dịch Vụ</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentBookings?.map(item => (
                        <tr key={item._id}>
                          <td><strong>{item.orderCode}</strong></td>
                          <td>{item.firstName} {item.lastName}</td>
                          <td>{item.serviceType}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: STATUS_MAP[item.status]?.bg,
                                color: STATUS_MAP[item.status]?.color
                              }}
                            >
                              {STATUS_MAP[item.status]?.icon} {STATUS_MAP[item.status]?.label}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!dashboardData?.recentBookings || dashboardData.recentBookings.length === 0) && (
                        <tr>
                          <td colSpan="4" className="empty-cell">Chưa có đơn hàng nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Contacts Box */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Lời Nhắn Cần Phản Hồi</h3>
                  <button className="admin-text-btn" onClick={() => setActiveTab('contacts')}>Xem tất cả →</button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Họ Tên</th>
                        <th>Email</th>
                        <th>Tiêu Đề</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentPendingContacts?.map(contact => (
                        <tr key={contact._id}>
                          <td><strong>{contact.name}</strong></td>
                          <td>{contact.email}</td>
                          <td>{contact.subject || 'Liên hệ chung'}</td>
                          <td>
                            <button
                              className="btn-sm btn-success"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                              onClick={() => handleToggleContactResolve(contact)}
                            >
                              <IconCheck /> Đánh dấu xử lý
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!dashboardData?.recentPendingContacts || dashboardData.recentPendingContacts.length === 0) && (
                        <tr>
                          <td colSpan="4" className="empty-cell">Không có liên hệ chưa xử lý</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="admin-content-section">
            {/* Filter Bar */}
            <div className="admin-filter-bar">
              <div className="filter-group">
                <label>Lọc theo trạng thái:</label>
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => {
                    setBookingFilterStatus(e.target.value);
                    setBookingPage(1);
                  }}
                  className="admin-select"
                >
                  <option value="">-- Tất cả trạng thái --</option>
                  <option value="PENDING">Chờ Xử Lý</option>
                  <option value="CONFIRMED">Đã Xác Nhận</option>
                  <option value="PICKED_UP">Đã Lấy Đồ</option>
                  <option value="WASHING">Đang Giặt</option>
                  <option value="DELIVERING">Đang Giao</option>
                  <option value="COMPLETED">Hoàn Thành</option>
                  <option value="CANCELLED">Đã Hủy</option>
                </select>
              </div>

              <div className="filter-info">
                Tổng cộng: <strong>{bookings.length}</strong> đơn trong trang
              </div>
            </div>

            {/* Orders Table */}
            <div className="admin-panel">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã Đơn</th>
                      <th>Khách Hàng</th>
                      <th>Số Điện Thoại</th>
                      <th>Địa Chỉ / Quận</th>
                      <th>Ngày Hẹn Lấy</th>
                      <th>Trạng Thái Hiện Tại</th>
                      <th>Chuyển Trạng Thái Sau</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((item) => {
                      const nextSt = NEXT_STATUS[item.status];
                      return (
                        <tr key={item._id}>
                          <td><strong className="order-code-badge">{item.orderCode}</strong></td>
                          <td>
                            <strong>{item.firstName} {item.lastName}</strong>
                            <div className="sub-text">{item.email}</div>
                          </td>
                          <td>{item.phone}</td>
                          <td>{item.address}, {item.suburb}</td>
                          <td>{item.pickupDate} ({item.pickupTime || 'Cả ngày'})</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: STATUS_MAP[item.status]?.bg,
                                color: STATUS_MAP[item.status]?.color
                              }}
                            >
                              {STATUS_MAP[item.status]?.icon} {STATUS_MAP[item.status]?.label}
                            </span>
                          </td>
                          <td>
                            {nextSt ? (
                              <button
                                className="btn-sm btn-next-status"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                                onClick={() => handleUpdateStatus(item._id, nextSt)}
                              >
                                {STATUS_MAP[nextSt]?.icon} Chuyển: {STATUS_MAP[nextSt]?.label}
                              </button>
                            ) : (
                              <span className="text-muted">Đã kết thúc</span>
                            )}
                          </td>
                          <td>
                            <div className="action-row">
                              <button
                                className="btn-icon"
                                title="Xem chi tiết"
                                onClick={() => setSelectedBooking(item)}
                              >
                                <IconEye />
                              </button>

                              {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                                <button
                                  className="btn-icon danger"
                                  title="Hủy đơn hàng"
                                  onClick={() => {
                                    if (window.confirm(`Bạn có chắc chắn muốn HỦY đơn ${item.orderCode}?`)) {
                                      handleUpdateStatus(item._id, 'CANCELLED');
                                    }
                                  }}
                                >
                                  <IconX />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="8" className="empty-cell">Không tìm thấy đơn hàng phù hợp</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {bookingTotalPages > 1 && (
                <div className="admin-pagination">
                  <button
                    disabled={bookingPage <= 1}
                    onClick={() => setBookingPage(p => p - 1)}
                  >
                    ← Trang trước
                  </button>
                  <span>Trang {bookingPage} / {bookingTotalPages}</span>
                  <button
                    disabled={bookingPage >= bookingTotalPages}
                    onClick={() => setBookingPage(p => p + 1)}
                  >
                    Trang sau →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CONTACTS MANAGEMENT */}
        {activeTab === 'contacts' && (
          <div className="admin-content-section">
            <div className="admin-filter-bar">
              <div className="filter-group">
                <label>Trạng thái xử lý:</label>
                <select
                  value={contactFilterStatus}
                  onChange={(e) => {
                    setContactFilterStatus(e.target.value);
                    setContactPage(1);
                  }}
                  className="admin-select"
                >
                  <option value="">-- Tất cả liên hệ --</option>
                  <option value="PENDING">Chưa xử lý</option>
                  <option value="PROCESSED">Đã xử lý</option>
                </select>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ngày Gửi</th>
                      <th>Họ & Tên</th>
                      <th>Email</th>
                      <th>Số Điện Thoại</th>
                      <th>Chủ Đề</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c._id}>
                        <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.phone || 'N/A'}</td>
                        <td>{c.subject || 'Liên hệ chung'}</td>
                        <td>
                          {c.status === 'PROCESSED' ? (
                            <span className="status-badge success"><IconCheck /> Đã Xử Lý</span>
                          ) : (
                            <span className="status-badge warning"><IconClock /> Chưa Xử Lý</span>
                          )}
                        </td>
                        <td>
                          <div className="action-row">
                            <button
                              className={`btn-sm ${c.status === 'PROCESSED' ? 'btn-secondary' : 'btn-success'}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                              onClick={() => handleToggleContactResolve(c)}
                            >
                              {c.status === 'PROCESSED' ? <><IconRefresh /> Chưa xử lý</> : <><IconCheck /> Đã xử lý</>}
                            </button>
                            <button
                              className="btn-icon"
                              title="Đọc nội dung"
                              onClick={() => setSelectedContact(c)}
                            >
                              <IconEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-cell">Không có lời nhắn liên hệ nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {contactTotalPages > 1 && (
                <div className="admin-pagination">
                  <button
                    disabled={contactPage <= 1}
                    onClick={() => setContactPage(p => p - 1)}
                  >
                    ← Trang trước
                  </button>
                  <span>Trang {contactPage} / {contactTotalPages}</span>
                  <button
                    disabled={contactPage >= contactTotalPages}
                    onClick={() => setContactPage(p => p + 1)}
                  >
                    Trang sau →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: GIFT CARDS */}
        {activeTab === 'giftcards' && (
          <div className="admin-content-section">
            <div className="admin-panel">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã Thẻ</th>
                      <th>Mệnh Giá</th>
                      <th>Người Gửi</th>
                      <th>Người Nhận</th>
                      <th>Email Nhận</th>
                      <th>Ngày Giao Thẻ</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {giftCards.map((card) => (
                      <tr key={card._id}>
                        <td><strong className="order-code-badge">{card.code}</strong></td>
                        <td><strong style={{ color: 'var(--primary)' }}>${card.amount} AUD</strong></td>
                        <td>{card.senderName} ({card.senderEmail})</td>
                        <td>{card.recipientName}</td>
                        <td>{card.recipientEmail}</td>
                        <td>{card.deliveryDate}</td>
                        <td>
                          <span className={`status-badge ${card.status === 'ACTIVE' ? 'success' : 'secondary'}`}>
                            {card.status === 'ACTIVE' ? <><IconCheck /> Đang hoạt động</> : card.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {giftCards.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-cell">Chưa có thẻ quà tặng nào được bán</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USERS */}
        {activeTab === 'users' && (
          <div className="admin-content-section">
            <div className="admin-panel">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Họ & Tên</th>
                      <th>Email</th>
                      <th>Số Điện Thoại</th>
                      <th>Vai Trò (Role)</th>
                      <th>Trạng Thái Tài Khoản</th>
                      <th>Thao Tác Khoá/Mở Khoá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || 'Chưa cập nhật'}</td>
                        <td>
                          <span className={`role-badge role-${u.role?.toLowerCase()}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {u.isActive ? (
                            <span className="status-badge success"><IconCheck /> Hoạt động</span>
                          ) : (
                            <span className="status-badge danger"><IconLock /> Đã khoá</span>
                          )}
                        </td>
                        <td>
                          {u._id !== user?.id && (
                            <button
                              className={`btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                              onClick={() => handleToggleUserActive(u._id)}
                            >
                              {u.isActive ? <><IconLock /> Khoá TK</> : <><IconUnlock /> Mở Khoá</>}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedBooking(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>📄 Chi Tiết Đơn Hàng #{selectedBooking.orderCode}</h3>
              <button onClick={() => setSelectedBooking(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="detail-grid">
                <div><strong>Họ tên:</strong> {selectedBooking.firstName} {selectedBooking.lastName}</div>
                <div><strong>Email:</strong> {selectedBooking.email}</div>
                <div><strong>SĐT:</strong> {selectedBooking.phone}</div>
                <div><strong>Dịch vụ:</strong> {selectedBooking.serviceType}</div>
                <div><strong>Địa chỉ:</strong> {selectedBooking.address}, {selectedBooking.suburb}, {selectedBooking.state}</div>
                <div><strong>Ngày lấy đồ:</strong> {selectedBooking.pickupDate} ({selectedBooking.pickupTime})</div>
                <div><strong>Ghi chú:</strong> {selectedBooking.notes || 'Không có'}</div>
                <div><strong>Trạng thái:</strong> {STATUS_MAP[selectedBooking.status]?.label}</div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedContact(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>💬 Chi Tiết Lời Nhắn Từ {selectedContact.name}</h3>
              <button onClick={() => setSelectedContact(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>SĐT:</strong> {selectedContact.phone || 'N/A'}</p>
              <p><strong>Chủ đề:</strong> {selectedContact.subject || 'N/A'}</p>
              <hr />
              <p><strong>Nội dung:</strong></p>
              <div className="message-content-box">{selectedContact.message}</div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="btn btn-success"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => {
                  handleToggleContactResolve(selectedContact);
                  setSelectedContact(null);
                }}
              >
                {selectedContact.status === 'PROCESSED' ? <><IconRefresh /> Chưa xử lý</> : <><IconCheck /> Đã Xử Lý</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedContact(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
