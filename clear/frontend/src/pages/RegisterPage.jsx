import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
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

/* ─── Password Strength ──────────────────────────────────────────────────── */
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
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 9999,
              background: i <= strength ? colors[strength] : '#e5e7eb',
              transition: 'background 0.35s ease',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11.5, color: colors[strength] || '#9ca3af', fontWeight: 500 }}>
        {strength > 0 && `Độ mạnh mật khẩu: ${labels[strength]}`}
      </p>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate   = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [agreed,      setAgreed]      = useState(false);
  const [focusField,  setFocusField]  = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.name.trim())   return 'Vui lòng nhập họ và tên!';
    if (!form.email.trim())  return 'Vui lòng nhập email!';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không hợp lệ!';
    if (!form.password)      return 'Vui lòng nhập mật khẩu!';
    if (form.password.length < 6)             return 'Mật khẩu phải có ít nhất 6 ký tự!';
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
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    form.phone.trim(),
        password: form.password,
      });
      setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/my-orders', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: '100%',
    padding: '11px 14px 11px 40px',
    border: `1.5px solid ${
      focusField === name ? '#1a56db'
      : error && !form[name] ? '#ef4444'
      : '#e5e7eb'
    }`,
    borderRadius: 10,
    fontSize: 14,
    color: '#1e293b',
    background: focusField === name ? '#f8faff' : '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  });

  const iconStyle = {
    position: 'absolute',
    left: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
    lineHeight: 0,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: -120, left: -120, width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -100, right: -100, width: 350, height: 350,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 20,
        boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Top gradient strip */}
        <div style={{
          height: 5,
          background: 'linear-gradient(90deg, #1a56db, #0ea5e9, #7c3aed)',
        }} />

        <div style={{ padding: '32px 36px 28px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            {/* Logo */}
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', marginBottom: 20,
            }}>
              <div style={{
                width: 44, height: 44,
                background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(26,86,219,0.35)',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>TLaundry</span>
            </Link>

            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Tạo tài khoản mới
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
              Đăng ký để theo dõi đơn giặt và nhận ưu đãi độc quyền
            </p>
          </div>

          {/* Role info badge */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
            border: '1px solid #bfdbfe',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 22,
          }}>
            <div style={{
              width: 32, height: 32, minWidth: 32,
              background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e40af' }}>
                Tài khoản Khách hàng
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                Tài khoản đăng ký sẽ là <strong>Khách hàng</strong>. Tài khoản Admin/Staff được cấp bởi quản lý hệ thống.
              </p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 14px', marginBottom: 18,
              animation: 'slideDown 0.25s ease',
            }} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: 13.5, color: '#dc2626', fontWeight: 500 }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 10, padding: '12px 14px', marginBottom: 18,
            }} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ fontSize: 13.5, color: '#15803d', fontWeight: 500 }}>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Name + Phone row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {/* Name */}
              <div>
                <label htmlFor="reg-name" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusField('name')}
                    onBlur={() => setFocusField('')}
                    style={inputStyle('name')}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Số điện thoại
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z"/></svg>
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    placeholder="0901 234 567"
                    value={form.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusField('phone')}
                    onBlur={() => setFocusField('')}
                    style={inputStyle('phone')}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="reg-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField('')}
                  style={inputStyle('email')}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="reg-password" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Mật khẩu <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField('')}
                  style={{ ...inputStyle('password'), paddingRight: 42 }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label="Hiện/ẩn mật khẩu"
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                    padding: 2, lineHeight: 0,
                  }}
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="reg-confirm" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Xác nhận mật khẩu <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={form.confirmPassword && form.password !== form.confirmPassword ? '#ef4444' : 'currentColor'} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusField('confirmPassword')}
                  onBlur={() => setFocusField('')}
                  style={{
                    ...inputStyle('confirmPassword'),
                    paddingRight: 42,
                    borderColor: form.confirmPassword && form.password !== form.confirmPassword
                      ? '#ef4444'
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? '#22c55e'
                      : focusField === 'confirmPassword' ? '#1a56db' : '#e5e7eb',
                  }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label="Hiện/ẩn xác nhận mật khẩu"
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                    padding: 2, lineHeight: 0,
                  }}
                >
                  <EyeIcon open={showConfirm} />
                </button>
                {/* Match indicator */}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <span style={{
                    position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
                    color: '#22c55e', lineHeight: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, fontWeight: 500 }}>Mật khẩu không khớp!</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <label htmlFor="reg-terms" style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              cursor: 'pointer', marginBottom: 20, userSelect: 'none',
            }}>
              <div style={{ position: 'relative', marginTop: 1, flexShrink: 0 }}>
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
                />
                <div style={{
                  width: 18, height: 18,
                  border: `2px solid ${agreed ? '#1a56db' : '#d1d5db'}`,
                  borderRadius: 5,
                  background: agreed ? '#1a56db' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
                Tôi đồng ý với{' '}
                <Link to="/terms" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>Điều khoản Dịch vụ</Link>
                {' '}và{' '}
                <Link to="/privacy" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>Chính sách Bảo mật</Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading || !!success}
              style={{
                width: '100%',
                padding: '13px 24px',
                background: loading || success
                  ? '#93c5fd'
                  : 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 11,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading || success ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.25s ease',
                boxShadow: loading || success ? 'none' : '0 4px 15px rgba(26,86,219,0.35)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={e => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,86,219,0.45)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = loading || success ? 'none' : '0 4px 15px rgba(26,86,219,0.35)';
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 17, height: 17,
                    border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Đang tạo tài khoản...
                </>
              ) : success ? '✓ Đã tạo thành công!' : 'Tạo Tài Khoản Khách Hàng'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          padding: '18px 36px',
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: 13.5, color: '#64748b' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#1a56db', fontWeight: 700, textDecoration: 'none' }}>
              Đăng nhập ngay
            </Link>
          </p>
          <Link to="/" style={{ fontSize: 12.5, color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
            Quay về trang chủ
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default RegisterPage;
