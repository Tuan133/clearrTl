import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';


const PhoneIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.6 10.8z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAdminOrStaff, logout } = useAuth();

  const aboutLinks = [
    { label: t.header.aboutJims, href: '/about' },
    { label: t.header.ourTeam, href: '/about' },
  ];

  const serviceLinks = [
    { label: t.header.domestic, href: '/services' },
    { label: t.header.commercial, href: '/services' },
    { label: t.header.ironing, href: '/services' },
    { label: t.header.dryCleaning, href: '/services' },
  ];

  return (
    <>
      <header className="header">
        <nav className="nav">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-text">
              <span>TLaundry</span>
              <span>Laundry Services</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            <li className="nav-item">
              <button className="nav-link">{t.header.aboutUs} <ChevronDown /></button>
              <div className="dropdown">
                {aboutLinks.map(l => (
                  <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)}>{l.label}</Link>
                ))}
              </div>
            </li>
            <li className="nav-item">
              <button className="nav-link">{t.header.services} <ChevronDown /></button>
              <div className="dropdown">
                {serviceLinks.map(l => (
                  <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)}>{l.label}</Link>
                ))}
              </div>
            </li>
            <li><Link to="/pricing" className="nav-link">{t.header.pricing}</Link></li>

            <li><Link to="/gift-card" className="nav-link">{t.header.giftCard}</Link></li>
            <li><Link to="/contact" className="nav-link">{t.header.contact}</Link></li>
          </ul>

          {/* CTAs + Language Switcher */}
          <div className="nav-ctas">
            <button className="lang-btn" onClick={toggleLanguage} title="Đổi ngôn ngữ / Change language">
              <GlobeIcon />
              <span className="lang-text">{lang === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}</span>
            </button>

            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen(v => !v)}
                  aria-label="Menu tài khoản"
                >
                  <div className="user-avatar-mini">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-name-mini">{user?.name?.split(' ').pop()}</span>
                  <ChevronDown />
                </button>
                {userMenuOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setUserMenuOpen(false)} />
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{user?.name}</p>
                        <p className="user-dropdown-email">{user?.email}</p>
                        <span className={`auth-role-badge auth-role-badge--${user?.role?.toLowerCase()}`}>{user?.role}</span>
                      </div>
                      <div className="user-dropdown-body">
                        {!isAdminOrStaff && (
                          <Link to="/my-orders" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                            Lịch sử đơn hàng
                          </Link>
                        )}
                        {isAdminOrStaff && (
                          <Link to="/admin" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            Quản trị Admin
                          </Link>
                        )}
                        <button
                          className="user-dropdown-item user-dropdown-item--danger"
                          onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button className="btn-login" onClick={() => navigate('/login')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Đăng nhập
              </button>
            )}

            <button className="btn-quote" onClick={() => navigate('/booking')}>
              <CalendarIcon /> {t.header.requestQuote}
            </button>
            <a href="tel:131546" className="btn-phone">
              <PhoneIcon /> {t.header.phone}
            </a>
          </div>


          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-text">
            <span style={{ color: 'var(--primary)', fontSize: '18px', fontWeight: 800 }}>TLaundry</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
        </div>
        <nav>
          {[
            { label: t.header.aboutUs, href: '/about' },
            { label: t.header.services, href: '/services' },
            { label: t.header.pricing, href: '/pricing' },

            { label: t.header.giftCard, href: '/gift-card' },
            { label: t.header.contact, href: '/contact' },
          ].map(l => (
            <Link
              key={l.label}
              to={l.href}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="lang-btn-mobile" onClick={toggleLanguage}>
              <GlobeIcon /> Ngôn ngữ / Language: <strong>{lang === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'}</strong>
            </button>
            <button
              className="btn btn-primary"
              style={{ justifyContent: 'center' }}
              onClick={() => { navigate('/booking'); setMobileOpen(false); }}
            >
              {t.header.requestQuote}
            </button>
            <a href="tel:131546" className="btn btn-cyan" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {t.header.phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;

