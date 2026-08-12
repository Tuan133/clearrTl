import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ['', 'Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  if (!password) return null;

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 9999,
              background: i <= strength ? colors[strength] : '#e5e7eb',
              transition: 'background 0.3s ease'
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 12, color: colors[strength] || '#6b7280' }}>
        {strength > 0 && `Độ mạnh: ${labels[strength]}`}
      </p>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Vui lòng nhập họ và tên!';
    if (!form.email.trim()) return 'Vui lòng nhập email!';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không hợp lệ!';
    if (!form.password) return 'Vui lòng nhập mật khẩu!';
    if (form.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự!';
    if (form.password !== form.confirmPassword) return 'Mật khẩu xác nhận không khớp!';
    if (!agreed) return 'Vui lòng đồng ý với Điều khoản & Điều kiện!';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password
      });
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/my-orders', { replace: true }), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-bg-blur auth-bg-blur--1" />
      <div className="auth-bg-blur auth-bg-blur--2" />

      <div className="auth-card" style={{ maxWidth: 520 }}>
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
          <h1 className="auth-card__title">Tạo tài khoản mới</h1>
          <p className="auth-card__subtitle">Đăng ký để theo dõi đơn giặt và nhận ưu đãi độc quyền</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert--success" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {success}
            </div>
          )}

          {/* Two columns: Name + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="auth-field">
              <label htmlFor="reg-name" className="auth-label">Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  className="auth-input"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-phone" className="auth-label">Số điện thoại</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z"/></svg>
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  className="auth-input"
                  placeholder="0901234567"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input
                id="reg-email"
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
            <label htmlFor="reg-password" className="auth-label">Mật khẩu <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="reg-password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                className="auth-input"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(v => !v)} aria-label="Toggle password">
                <EyeIcon open={showPwd} />
              </button>
            </div>
            <PasswordStrength password={form.password} />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm" className="auth-label">Xác nhận mật khẩu <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                className="auth-input"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                style={{
                  borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#ef4444' : undefined
                }}
              />
              <button type="button" className="auth-pwd-toggle" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>Mật khẩu không khớp!</p>
            )}
          </div>

          {/* Terms checkbox */}
          <label className="auth-checkbox" htmlFor="reg-terms">
            <input
              id="reg-terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              Tôi đồng ý với{' '}
              <Link to="/terms" className="auth-link">Điều khoản Dịch vụ</Link>
              {' '}và{' '}
              <Link to="/privacy" className="auth-link">Chính sách Bảo mật</Link>
            </span>
          </label>

          <button
            type="submit"
            id="register-submit"
            className="auth-btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner" />
                Đang tạo tài khoản...
              </>
            ) : 'Tạo Tài Khoản'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link></p>
          <p style={{ marginTop: 8 }}>
            <Link to="/" className="auth-link-muted">← Quay về trang chủ</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
