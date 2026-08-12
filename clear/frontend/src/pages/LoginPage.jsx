import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.user.role === 'ADMIN' || data.user.role === 'STAFF') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/login' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <main className="auth-page">
      {/* Background decoration */}
      <div className="auth-bg-blur auth-bg-blur--1" />
      <div className="auth-bg-blur auth-bg-blur--2" />

      <div className="auth-card">
        {/* Header */}
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span>TLaundry</span>
          </Link>
          <h1 className="auth-card__title">Chào mừng trở lại!</h1>
          <p className="auth-card__subtitle">Đăng nhập để xem lịch sử đơn giặt và quản lý tài khoản</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><MailIcon /></span>
              <input
                id="login-email"
                type="email"
                name="email"
                className="auth-input"
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">Mật khẩu</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon"><LockIcon /></span>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                className="auth-input"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit"
            className="auth-btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner" />
                Đang đăng nhập...
              </>
            ) : 'Đăng Nhập'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-card__footer">
          <p>Chưa có tài khoản? <Link to="/register" className="auth-link">Đăng ký ngay</Link></p>
          <p style={{ marginTop: 8 }}>
            <Link to="/" className="auth-link-muted">← Quay về trang chủ</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="auth-demo-box">
          <p className="auth-demo-title">🔑 Tài khoản demo</p>
          <div className="auth-demo-grid">
            <button
              className="auth-demo-btn"
              onClick={() => setForm({ email: 'customer@tlaundry.com', password: 'customer123' })}
            >
              <span className="auth-role-badge auth-role-badge--customer">CUSTOMER</span>
              customer@tlaundry.com
            </button>
            <button
              className="auth-demo-btn"
              onClick={() => setForm({ email: 'admin@tlaundry.com', password: 'admin123456' })}
            >
              <span className="auth-role-badge auth-role-badge--admin">ADMIN</span>
              admin@tlaundry.com
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
