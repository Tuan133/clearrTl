import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const PhoneIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronDown = () => (
  <svg className="nav-chevron" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAdminOrStaff, logout } = useAuth();

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
          {/* Logo - Kept intact as requested */}
          <Link to="/" className="logo">
            <div className="logo-text">
              <span>TLaundry</span>
              <span>Laundry Services</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t.header.aboutUs}
              </NavLink>
            </li>
            <li
              className={`nav-item ${servicesOpen ? 'open' : ''}`}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <NavLink
                to="/services"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setServicesOpen(false)}
              >
                <span>{t.header.services}</span>
                <ChevronDown />
              </NavLink>
              <div className={`dropdown ${servicesOpen ? 'open' : ''}`}>
                {serviceLinks.map(l => (
                  <Link
                    key={l.label}
                    to={l.href}
                    onClick={() => {
                      setServicesOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </li>
            <li>
              <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t.header.pricing}
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t.header.contact}
              </NavLink>
            </li>
          </ul>

          {/* CTAs + Language & User Menu */}
          <div className="nav-ctas">
            {/* Group 1: Utility (Language + User) */}
            <div className="nav-utility-group">
              <button
                className="lang-btn"
                onClick={toggleLanguage}
                title={lang === 'vi' ? 'Chuyển sang Tiếng Anh (English)' : 'Switch to Vietnamese (Tiếng Việt)'}
                aria-label="Toggle language"
              >
                <GlobeIcon />
                <span className="lang-code">{lang === 'vi' ? 'VN' : 'EN'}</span>
              </button>

              {isAuthenticated ? (
                <div className="user-menu-wrapper">
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
                      <div className="dropdown-backdrop" onClick={() => setUserMenuOpen(false)} />
                      <div className="user-dropdown">
                        <div className="user-dropdown-header">
                          <p className="user-dropdown-name">{user?.name}</p>
                          <p className="user-dropdown-email">{user?.email}</p>
                          <span className={`auth-role-badge auth-role-badge--${user?.role?.toLowerCase()}`}>{user?.role}</span>
                        </div>
                        <div className="user-dropdown-body">
                          {!isAdminOrStaff && (
                            <Link to="/my-orders" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
                              Lịch sử đơn hàng
                            </Link>
                          )}
                          {isAdminOrStaff && (
                            <Link to="/admin" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                              Quản trị Admin
                            </Link>
                          )}
                          <button
                            className="user-dropdown-item user-dropdown-item--danger"
                            onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button className="btn-login" onClick={() => navigate('/login')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>

            {/* Subtle Vertical Divider */}
            <div className="nav-divider" aria-hidden="true" />

            {/* Group 2: Action CTAs */}
            <div className="nav-action-group">
              <button className="btn-quote" onClick={() => navigate('/booking')}>
                <CalendarIcon />
                <span>{t.header.requestQuote}</span>
              </button>
              <a href="tel:131546" className="btn-phone">
                <PhoneIcon />
                <span>{t.header.phone}</span>
              </a>
            </div>
          </div>

          {/* Mobile Hamburger */}
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

