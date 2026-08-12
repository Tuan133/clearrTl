import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GiftCardPage from './pages/GiftCardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminPage from './pages/AdminPage';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Quay lại đầu trang"
      title="Quay lại đầu trang"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-box">
          <div className="chat-box-header">
            <div className="chat-box-avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div>
              <div className="chat-box-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Hỗ trợ TLaundry
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"/>
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                  <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                </svg>
              </div>
              <div className="chat-box-status">
                <span className="online-dot"></span> Đang trực tuyến
              </div>
            </div>
            <button className="chat-box-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chat-box-body">
            <p className="chat-box-welcome">Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn hôm nay?</p>
            <div className="chat-quick-actions">
              <a href="/booking" className="chat-action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--primary)' }}>
                  <rect x="3" y="2" width="18" height="20" rx="3"/>
                  <circle cx="12" cy="13" r="4.5"/>
                  <path d="M12 10.5a2.5 2.5 0 0 0-2.5 2.5"/>
                </svg>
                Đặt dịch vụ giặt sấy
              </a>
              <a href="/pricing" className="chat-action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--primary)' }}>
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Xem bảng giá chi tiết
              </a>
              <a href="tel:131546" className="chat-action-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Hotline tư vấn: 131 546
              </a>
            </div>
          </div>
        </div>
      )}

      {!isOpen && showTooltip && (
        <div className="chat-bubble">
          <span className="online-dot"></span> Trò chuyện với chúng tôi
        </div>
      )}

      <div className="chat-btn-wrapper">
        <div className="chat-btn-pulse"></div>
        <span className="chat-online-badge"></span>
        <button
          className="chat-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          aria-label="Chat"
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="rgba(255,255,255,0.18)"/>
              <circle cx="9" cy="11.5" r="1.2" fill="currentColor"/>
              <circle cx="12" cy="11.5" r="1.2" fill="currentColor"/>
              <circle cx="15" cy="11.5" r="1.2" fill="currentColor"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function AppLayout() {
  const [toastShown, setToastShown] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setToastShown(true);
    setTimeout(() => setToastShown(false), 3500);
  };

  return (
    <>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/gift-card" element={<GiftCardPage />} />

        {/* ── Auth Routes ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Protected: Customer only ── */}
        <Route path="/my-orders" element={
          <PrivateRoute roles={['CUSTOMER', 'ADMIN', 'STAFF']}>
            <OrderHistoryPage />
          </PrivateRoute>
        } />

        {/* ── Protected: Admin & Staff Portal ── */}
        <Route path="/admin" element={
          <PrivateRoute roles={['ADMIN', 'STAFF']}>
            <AdminPage />
          </PrivateRoute>
        } />

        <Route path="/privacy" element={
          <main style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', minHeight: '60vh' }}>
            <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: 20 }}>Chính Sách Bảo Mật</h1>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.8 }}>
              TLaundry cam kết bảo vệ thông tin cá nhân của bạn theo Luật Bảo Mật Sài Gòn 1988.
            </p>
          </main>
        } />
        <Route path="/terms" element={
          <main style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', minHeight: '60vh' }}>
            <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: 20 }}>Điều Khoản & Điều Kiện</h1>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.8 }}>
              Khi sử dụng dịch vụ của TLaundry, bạn đồng ý với các điều khoản và điều kiện dịch vụ.
            </p>
          </main>
        } />
        <Route path="*" element={
          <main style={{ padding: '120px 24px', textAlign: 'center', minHeight: '60vh' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: 12 }}>Không Tìm Thấy Trang</h1>
            <p style={{ color: 'var(--text-gray)', marginBottom: 28 }}>Trang bạn tìm kiếm không tồn tại.</p>
            <a href="/" className="btn btn-primary">Trở Về Trang Chủ</a>
          </main>
        } />
      </Routes>

      <Footer onSubscribe={() => showToast('🎉 Đã đăng ký thành công! Mã ưu đãi $10 sẽ được gửi đến email của bạn.')} />
      <BackToTop />
      <ChatWidget />

      {/* Toast notification */}
      <div style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: `translateX(-50%) translateY(${toastShown ? 0 : 30}px)`,
        opacity: toastShown ? 1 : 0,
        transition: 'all 0.35s ease',
        background: 'var(--primary)',
        color: 'white',
        padding: '14px 24px',
        borderRadius: 50,
        fontWeight: 700,
        fontSize: 14,
        boxShadow: 'var(--shadow-lg)',
        zIndex: 9999,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {toast}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;



